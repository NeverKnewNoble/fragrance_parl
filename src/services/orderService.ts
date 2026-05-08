"use server";

import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  orders,
  orderItems,
  orderTracking,
  cart,
  cartItems,
} from "@/db/schema";
import { auth } from "@/auth";
import type { Cart } from "@/types/cart";

// !! Order status type for database
export type OrderStatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// !! Order from database (orders table)
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatusType;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  updated_at?: string;
}

// !! Order item from database
export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  size_ml: number;
  price: number;
  quantity: number;
  created_at?: string;
  products?: {
    id: string;
    name: string;
    product_images: Array<{ image_url: string; is_primary: boolean }>;
  };
}

// !! Order tracking
export interface OrderTracking {
  id: string;
  order_id: string;
  status: OrderStatusType;
  updated_at: string;
}

export interface OrderWithDetails extends Order {
  order_items: OrderItem[];
  order_tracking: OrderTracking[];
}

export interface CreateOrderInput {
  user_id: string;
  cart: Cart;
  address_id: string;
}

async function requireUserId(passedUserId?: string): Promise<string> {
  const session = await auth();
  const sessionId = session?.user?.id;
  if (!sessionId) throw new Error("User not authenticated");
  if (passedUserId && passedUserId !== sessionId) {
    throw new Error("User mismatch");
  }
  return sessionId;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD${timestamp}${random}`;
}

// !! Create an order from a cart, write items + initial tracking, then clear cart
export async function createOrder(
  input: CreateOrderInput
): Promise<OrderWithDetails> {
  const sessionId = await requireUserId(input.user_id);

  const orderNumber = generateOrderNumber();
  const [order] = await db
    .insert(orders)
    .values({
      userId: sessionId,
      orderNumber,
      status: "pending",
      subtotal: input.cart.sub_total,
      deliveryFee: input.cart.delivery_fee,
      total: input.cart.total,
      addressesId: input.address_id,
    })
    .returning();

  const itemsToInsert = input.cart.cart_items.map((item: any) => {
    const variant = item.products?.product_variants?.find(
      (v: any) => v.size_ml === item.size_ml
    );
    return {
      orderId: order.id,
      productId: item.product_id,
      productName: item.products?.name ?? "Unknown Product",
      sizeMl: item.size_ml,
      price: variant?.price ?? 0,
      quantity: item.quantity,
    };
  });

  if (itemsToInsert.length > 0) {
    await db.insert(orderItems).values(itemsToInsert);
  }

  await db
    .insert(orderTracking)
    .values({ orderId: order.id, status: "pending" });

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, sessionId));
  await db
    .update(cart)
    .set({ subTotal: 0, deliveryFee: 0, total: 0 })
    .where(eq(cart.userId, sessionId));

  return await getOrderWithDetails(order.id);
}

// !! Fetch a full order (items + tracking + product images)
export async function getOrderWithDetails(
  orderId: string
): Promise<OrderWithDetails> {
  const row = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        orderBy: [asc(orderItems.createdAt)],
        with: {
          product: { with: { images: true } },
        },
      },
      tracking: {
        orderBy: [asc(orderTracking.updatedAt)],
      },
    },
  });

  if (!row) throw new Error("Order not found");

  return {
    id: row.id,
    user_id: row.userId,
    order_number: row.orderNumber,
    status: row.status,
    subtotal: row.subtotal,
    delivery_fee: row.deliveryFee,
    total: row.total,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    order_items: ((row as any).items ?? []).map((it: any) => ({
      id: it.id,
      order_id: it.orderId,
      product_name: it.productName,
      size_ml: it.sizeMl,
      price: it.price,
      quantity: it.quantity,
      created_at: it.createdAt,
      products: it.product
        ? {
            id: it.product.id,
            name: it.product.name,
            product_images: (it.product.images ?? []).map((img: any) => ({
              image_url: img.imageUrl,
              is_primary: img.isPrimary,
            })),
          }
        : undefined,
    })),
    order_tracking: ((row as any).tracking ?? []).map((t: any) => ({
      id: t.id,
      order_id: t.orderId,
      status: t.status,
      updated_at: t.updatedAt,
    })),
  };
}

// !! All orders for the current user
export async function getUserOrders(
  userId: string
): Promise<OrderWithDetails[]> {
  const sessionId = await requireUserId(userId);
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.userId, sessionId))
    .orderBy(desc(orders.createdAt));
  return Promise.all(rows.map((r) => getOrderWithDetails(r.id)));
}

// !! Update an order's status; appends a tracking row
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusType
): Promise<void> {
  await db
    .update(orders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, orderId));
  await db.insert(orderTracking).values({ orderId, status });
}

// !! Read tracking history for an order
export async function getOrderTracking(
  orderId: string
): Promise<OrderTracking[]> {
  const rows = await db
    .select()
    .from(orderTracking)
    .where(eq(orderTracking.orderId, orderId))
    .orderBy(asc(orderTracking.updatedAt));
  return rows.map((r) => ({
    id: r.id,
    order_id: r.orderId,
    status: r.status,
    updated_at: r.updatedAt,
  }));
}
