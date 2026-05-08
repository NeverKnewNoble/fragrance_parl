"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { cart, cartItems } from "@/db/schema";
import { auth } from "@/auth";
import type {
  Cart,
  AddToCartInput,
  UpdateCartItemInput,
} from "@/types/cart";

const DEFAULT_DELIVERY_FEE = 15;
const DEFAULT_SIZE_ML = 50;

async function requireUserId(passedUserId?: string): Promise<string> {
  const session = await auth();
  const sessionId = session?.user?.id;
  if (!sessionId) throw new Error("User not authenticated");
  if (passedUserId && passedUserId !== sessionId) {
    throw new Error("User mismatch");
  }
  return sessionId;
}

// !! Fetch cart_items joined with their product, variants, and images
async function fetchCartItemsWithProducts(userId: string) {
  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, userId),
    with: {
      product: {
        with: { variants: true, images: true },
      },
    },
  });

  return items.map((it: any) => ({
    id: it.id,
    user_id: it.userId,
    product_id: it.productId,
    size_ml: it.sizeMl,
    quantity: it.quantity,
    products: it.product
      ? {
          id: it.product.id,
          name: it.product.name,
          slug: it.product.slug,
          is_active: it.product.isActive,
          product_variants: (it.product.variants ?? []).map((v: any) => ({
            size_ml: v.sizeMl,
            price: v.price,
          })),
          product_images: (it.product.images ?? []).map((img: any) => ({
            image_url: img.imageUrl,
            is_primary: img.isPrimary,
          })),
        }
      : undefined,
  }));
}

async function ensureCartRow(userId: string) {
  const [existing] = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, userId))
    .limit(1);
  if (existing) return existing;
  const [created] = await db.insert(cart).values({ userId }).returning();
  return created;
}

async function recalculateCartTotals(userId: string): Promise<Cart> {
  const items = await fetchCartItemsWithProducts(userId);
  const subtotal = items.reduce((sum, it) => {
    const variant = it.products?.product_variants?.find(
      (v: any) => v.size_ml === it.size_ml
    );
    const price = variant?.price ?? 0;
    return sum + price * it.quantity;
  }, 0);
  const deliveryFee = subtotal > 0 ? DEFAULT_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const [updated] = await db
    .update(cart)
    .set({ subTotal: subtotal, deliveryFee, total })
    .where(eq(cart.userId, userId))
    .returning();

  return {
    id: updated.id,
    user_id: updated.userId,
    cart_items: items as any,
    sub_total: updated.subTotal,
    delivery_fee: updated.deliveryFee,
    total: updated.total,
    created_at: updated.createdAt,
  };
}

// !! Public: get or lazily create the user's cart with items + nested product info
export async function getOrCreateCart(userId: string): Promise<Cart> {
  const sessionId = await requireUserId(userId);
  const c = await ensureCartRow(sessionId);
  const items = await fetchCartItemsWithProducts(sessionId);
  return {
    id: c.id,
    user_id: c.userId,
    cart_items: items as any,
    sub_total: c.subTotal,
    delivery_fee: c.deliveryFee,
    total: c.total,
    created_at: c.createdAt,
  };
}

// !! Public: add an item to the cart (or increment quantity if same product+size)
export async function addToCart(
  userId: string,
  input: AddToCartInput
): Promise<Cart> {
  const sessionId = await requireUserId(userId);
  await ensureCartRow(sessionId);

  const sizeMl = input.size_ml ?? DEFAULT_SIZE_ML;
  const qty = input.quantity ?? 1;

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, sessionId),
        eq(cartItems.productId, input.product_id),
        eq(cartItems.sizeMl, sizeMl)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + qty })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      userId: sessionId,
      productId: input.product_id,
      sizeMl,
      quantity: qty,
    });
  }

  return await recalculateCartTotals(sessionId);
}

// !! Public: change a cart item's quantity (clamped to >= 1)
export async function updateCartItem(
  userId: string,
  input: UpdateCartItemInput
): Promise<Cart> {
  const sessionId = await requireUserId(userId);
  await db
    .update(cartItems)
    .set({ quantity: Math.max(1, input.quantity) })
    .where(and(eq(cartItems.id, input.id), eq(cartItems.userId, sessionId)));
  return await recalculateCartTotals(sessionId);
}

// !! Public: remove an item from the cart
export async function removeFromCart(
  userId: string,
  itemId: string
): Promise<Cart> {
  const sessionId = await requireUserId(userId);
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, sessionId)));
  return await recalculateCartTotals(sessionId);
}

// !! Public: clear all items + reset totals
export async function clearCart(userId: string): Promise<void> {
  const sessionId = await requireUserId(userId);
  await db.delete(cartItems).where(eq(cartItems.userId, sessionId));
  await db
    .update(cart)
    .set({ subTotal: 0, deliveryFee: 0, total: 0 })
    .where(eq(cart.userId, sessionId));
}

// !! Public: total quantity across all cart items (for nav badge)
export async function getCartCount(userId: string): Promise<number> {
  try {
    const sessionId = await requireUserId(userId);
    const rows = await db
      .select({ quantity: cartItems.quantity })
      .from(cartItems)
      .where(eq(cartItems.userId, sessionId));
    return rows.reduce((sum, r) => sum + r.quantity, 0);
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
}
