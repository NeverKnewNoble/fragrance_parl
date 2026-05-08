import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  doublePrecision,
  uuid,
  primaryKey,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";

// ============================================================================
// Auth.js (NextAuth v5) tables — required by @auth/drizzle-adapter
// ============================================================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ============================================================================
// Application tables
// ============================================================================

export const userRoleEnum = pgEnum("user_role_type", ["user", "admin"]);

export const userRole = pgTable("user_role", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").notNull().default("user"),
});

export const fragranceFamilies = pgTable("fragrance_families", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    fragranceFamilyId: integer("fragrance_family_id").references(
      () => fragranceFamilies.id,
      { onDelete: "set null" }
    ),
    slug: text("slug").notNull().unique(),
    isActive: boolean("is_active").notNull().default(true),
    price: doublePrecision("price"),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugIdx: index("products_slug_idx").on(table.slug),
    activeIdx: index("products_is_active_idx").on(table.isActive),
  })
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sizeMl: integer("size_ml").notNull(),
    price: doublePrecision("price").notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isOutOfStock: boolean("is_out_of_stock").notNull().default(false),
    isRestocked: boolean("is_restocked").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdx: index("product_variants_product_id_idx").on(table.productId),
    productSizeUnique: uniqueIndex("product_variants_product_size_unique").on(
      table.productId,
      table.sizeMl
    ),
  })
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdx: index("product_images_product_id_idx").on(table.productId),
  })
);

export const noteTypeEnum = pgEnum("product_note_type", ["top", "middle", "base"]);

export const productNotes = pgTable(
  "product_notes",
  {
    id: serial("id").primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    noteName: text("note_name").notNull(),
    noteType: noteTypeEnum("note_type").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdx: index("product_notes_product_id_idx").on(table.productId),
  })
);

export const cart = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  subTotal: doublePrecision("sub_total").notNull().default(0),
  deliveryFee: doublePrecision("delivery_fee").notNull().default(0),
  total: doublePrecision("total").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sizeMl: integer("size_ml").notNull(),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("cart_items_user_id_idx").on(table.userId),
    userProductSizeUnique: uniqueIndex("cart_items_user_product_size_unique").on(
      table.userId,
      table.productId,
      table.sizeMl
    ),
  })
);

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    addressLine: text("address_line").notNull(),
    city: text("city").notNull(),
    region: text("region").notNull(),
    instructions: text("instructions"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("addresses_user_id_idx").on(table.userId),
  })
);

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userProductUnique: uniqueIndex("favorites_user_product_unique").on(
      table.userId,
      table.productId
    ),
    userIdx: index("favorites_user_id_idx").on(table.userId),
  })
);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderNumber: text("order_number").notNull().unique(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: doublePrecision("subtotal").notNull(),
    deliveryFee: doublePrecision("delivery_fee").notNull(),
    total: doublePrecision("total").notNull(),
    addressesId: uuid("addresses_id").references(() => addresses.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("orders_user_id_idx").on(table.userId),
    createdIdx: index("orders_created_at_idx").on(table.createdAt),
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    sizeMl: integer("size_ml").notNull(),
    price: doublePrecision("price").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdx: index("order_items_order_id_idx").on(table.orderId),
  })
);

export const orderTracking = pgTable(
  "order_tracking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdx: index("order_tracking_order_id_idx").on(table.orderId),
  })
);

// ============================================================================
// Relations
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(userRole, { fields: [users.id], references: [userRole.userId] }),
  accounts: many(accounts),
  sessions: many(sessions),
  cart: one(cart, { fields: [users.id], references: [cart.userId] }),
  cartItems: many(cartItems),
  addresses: many(addresses),
  favorites: many(favorites),
  orders: many(orders),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(users, { fields: [userRole.userId], references: [users.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  fragranceFamily: one(fragranceFamilies, {
    fields: [products.fragranceFamilyId],
    references: [fragranceFamilies.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  notes: many(productNotes),
  cartItems: many(cartItems),
  favorites: many(favorites),
  orderItems: many(orderItems),
}));

export const fragranceFamiliesRelations = relations(fragranceFamilies, ({ many }) => ({
  products: many(products),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productNotesRelations = relations(productNotes, ({ one }) => ({
  product: one(products, {
    fields: [productNotes.productId],
    references: [products.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, { fields: [cart.userId], references: [users.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
  orders: many(orders),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  product: one(products, { fields: [favorites.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  address: one(addresses, { fields: [orders.addressesId], references: [addresses.id] }),
  items: many(orderItems),
  tracking: many(orderTracking),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderTrackingRelations = relations(orderTracking, ({ one }) => ({
  order: one(orders, { fields: [orderTracking.orderId], references: [orders.id] }),
}));

// ============================================================================
// Inferred types
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type UserRoleRow = typeof userRole.$inferSelect;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariantRow = typeof productVariants.$inferSelect;
export type ProductImageRow = typeof productImages.$inferSelect;
export type ProductNoteRow = typeof productNotes.$inferSelect;
export type FragranceFamilyRow = typeof fragranceFamilies.$inferSelect;

export type CartRow = typeof cart.$inferSelect;
export type CartItemRow = typeof cartItems.$inferSelect;
export type AddressRow = typeof addresses.$inferSelect;
export type FavoriteRow = typeof favorites.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type OrderTrackingRow = typeof orderTracking.$inferSelect;
