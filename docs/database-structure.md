# Database Structure

This document describes the database schema, relationships, and key operations for the Fragrance Parl e-commerce platform.

## Overview

- **Platform**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Storage**: Supabase Storage (used for product images)
- **Client**: `src/lib/supabase/client.ts`
- **Middleware**: `middleware.ts` -> `src/lib/supabase/middleware.ts`

---

## Entity-Relationship Diagram

```
auth.users (Supabase Auth)
  │
  ├──< user_role              (role: "user" | "admin")
  ├──< cart ──< cart_items >── products
  ├──< addresses
  ├──< favorites >── products
  └──< orders
         ├── addresses_id ──> addresses
         ├──< order_items
         └──< order_tracking

products
  ├── fragrance_family_id ──> fragrance_families
  ├──< product_variants
  ├──< product_images
  └──< product_notes

fragrance_families
```

Legend: `>──` = many-to-one, `──<` = one-to-many.

---

## Tables

### 1. `products`

Core product catalog. Prices live on variants, not on the product itself.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | Required |
| `description` | text | |
| `fragrance_family_id` | int | FK -> `fragrance_families.id` |
| `slug` | text | Auto-generated from `name` |
| `is_active` | bool | Controls visibility |
| `price` | numeric | Optional base price |
| `created_at` | timestamptz | |

**Key files**: `src/types/product.ts`, `src/utils/products.ts`, `src/components/admin/ProductUploadForm.tsx`.

**Operations**: `getAllProductsAndLinkages`, `getLatestProducts`, `deleteProduct`, `isActiveSwitch` (admin-only; checks `user_role`).

---

### 2. `fragrance_families`

Categorises products (e.g., Gourmand, Floral, Woody).

| Column | Type | Notes |
|---|---|---|
| `id` | int | PK, auto-increment |
| `name` | text | Display name |
| `icon` | text | Lucide icon name (optional) |

**Key files**: `src/types/family_fragrance.ts`, `src/utils/fragranceFamilies.ts`, `src/components/admin/FragranceFamilyManager.tsx`.

---

### 3. `product_variants`

Per-size SKUs. A single product has multiple variants (50ml, 75ml, 100ml, etc.), each with its own price and stock.

| Column | Type | Notes |
|---|---|---|
| `id` | int | PK |
| `product_id` | uuid | FK -> `products.id` |
| `size_ml` | int | e.g., 50, 75, 100 |
| `price` | numeric | Per-variant price |
| `stock_quantity` | int | |
| `is_out_of_stock` | bool | |
| `is_restocked` | bool | |
| `created_at` | timestamptz | |

**Operations**: `updateVariantStockStatus` in `src/utils/products.ts` (admin-only).

---

### 4. `product_images`

| Column | Type | Notes |
|---|---|---|
| `id` | int | PK |
| `product_id` | uuid | FK -> `products.id` |
| `image_url` | text | Supabase Storage URL |
| `is_primary` | bool | Featured image flag |
| `created_at` | timestamptz | |

Uploaded via `src/utils/imageUpload.ts`.

---

### 5. `product_notes`

Fragrance notes grouped by pyramid layer.

| Column | Type | Notes |
|---|---|---|
| `id` | int | PK |
| `product_id` | uuid | FK -> `products.id` |
| `note_name` | text | e.g., "Bergamot", "Rose" |
| `note_type` | enum | `top` \| `middle` \| `base` |
| `created_at` | timestamptz | |

---

### 6. `cart`

One cart per user. Totals recompute whenever items change.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK -> `auth.users.id` |
| `sub_total` | numeric | |
| `delivery_fee` | numeric | 15 when `sub_total > 0`, else 0 |
| `total` | numeric | `sub_total + delivery_fee` |
| `created_at` | timestamptz | |

**Operations** (`src/services/cartService.ts`): `getOrCreateCart`, `recalculateCartTotals`, `clearCart`, `getCartCount`.

> Note: the table has a legacy `cart_items` array column with a constraint that caused insertion issues. The service has fallback logic around this; real items live in the `cart_items` table below.

---

### 7. `cart_items`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK -> `auth.users.id` |
| `product_id` | uuid | FK -> `products.id` |
| `size_ml` | int | Matches the selected variant |
| `quantity` | int | |
| `created_at` | timestamptz | |

**Operations**: `addToCart` (increments if a row for the same product+size exists), `updateCartItem`, `removeFromCart`.

---

### 8. `orders`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK -> `auth.users.id` |
| `order_number` | text | `ORD{timestamp}{random}` |
| `status` | enum | `pending` \| `processing` \| `shipped` \| `delivered` \| `cancelled` |
| `subtotal` | numeric | |
| `delivery_fee` | numeric | |
| `total` | numeric | |
| `addresses_id` | uuid | FK -> `addresses.id` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Operations** (`src/services/orderService.ts`): `createOrder` (converts a cart into an order + items + initial tracking row), `getOrderWithDetails`, `getUserOrders`, `updateOrderStatus`. Admin listing: `fetchAllOrders` in `src/utils/orders.ts`.

---

### 9. `order_items`

Immutable snapshot of what was purchased (name + price captured at order time, so historical records survive product edits).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | FK -> `orders.id` |
| `product_name` | text | Snapshot |
| `size_ml` | int | |
| `quantity` | int | |
| `price` | numeric | Snapshot from variant |
| `created_at` | timestamptz | |

---

### 10. `order_tracking`

Append-only status timeline.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | FK -> `orders.id` |
| `status` | enum | Same set as `orders.status` |
| `updated_at` | timestamptz | |

One row on creation, plus a new row each time `updateOrderStatus` is called. Read via `getOrderTracking`.

---

### 11. `addresses`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK -> `auth.users.id` |
| `full_name` | text | |
| `email` | text | |
| `phone` | text | |
| `address_line` | text | |
| `city` | text | |
| `region` | text | |
| `instructions` | text | Optional |
| `is_default` | bool | At most one per user |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Operations** (`src/services/addressService.ts`): `getUserAddresses`, `getDefaultAddress`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` (clears other defaults first).

---

### 12. `favorites`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK -> `auth.users.id` |
| `product_id` | uuid | FK -> `products.id` |

**Operations** (`src/utils/favorites.ts`): `loadFavorites`, `toggleFavorite`, `isFavorite`, `removeFavorite`.

---

### 13. `user_role`

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | FK -> `auth.users.id` |
| `role` | enum | `user` \| `admin` |

Assigned as `user` on signup (`src/lib/auth.ts`). Admin-only operations (product delete, stock toggle, visibility toggle) check this table before executing.

---

## Authentication

Handled entirely by Supabase Auth. See `src/lib/auth.ts`:

- `signUp` — creates auth user, inserts `user_role` row with `role: "user"`.
- `signIn` — email/password.
- `signInWithGoogle` — OAuth.
- `resetPassword`, `updatePassword`, `resendConfirmationEmail`, `signOut`.
- Client session hook: `src/hooks/useAuth.ts`.

---

## Data Flow Summary

1. **Catalog**: Admin creates a `product`, attaches `product_variants`, `product_images`, `product_notes`, and picks a `fragrance_family`.
2. **Browsing**: Shoppers view products with joined variants/images/notes; can toggle `favorites`.
3. **Cart**: `cart_items` are upserted per user; `cart` totals recomputed after each change.
4. **Checkout**: User picks/creates an `address`; `createOrder` converts the cart into an `order` with frozen `order_items` and an initial `order_tracking` entry, then clears the cart.
5. **Fulfilment**: Admin advances `order.status`; each change appends to `order_tracking`.

---

## Key Conventions & Gotchas

- **Price lives on variants, not products.** The `products.price` column is effectively unused in the UI.
- **Order items are snapshots.** Editing a product later does not mutate past orders.
- **One default address per user.** `setDefaultAddress` unsets all others in the same call.
- **Admin gating is application-side** via `user_role` lookups — not enforced by DB RLS policies visible in this repo.
- **Cart has a legacy array column.** Treat `cart_items` (the table) as the source of truth; ignore `cart.cart_items` (the column).
