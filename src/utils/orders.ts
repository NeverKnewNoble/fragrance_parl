"use server";

import { eq, desc } from "drizzle-orm";

import { db } from "@/db";
import { orders, orderTracking, userRole } from "@/db/schema";
import { auth } from "@/auth";
import type { OrderWithItems } from "@/types/order";

export type { OrderWithItems };

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not authenticated");
  const [row] = await db
    .select({ role: userRole.role })
    .from(userRole)
    .where(eq(userRole.userId, session.user.id))
    .limit(1);
  if (row?.role !== "admin") throw new Error("Admin access required");
}

// !! Admin: list every order with its address and items
export async function fetchAllOrders(): Promise<OrderWithItems[]> {
  await requireAdmin();

  const rows = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      address: true,
      items: true,
    },
  });

  return rows.map((o: any) => ({
    id: o.id,
    user_id: o.userId,
    order_number: o.orderNumber,
    status: o.status,
    subtotal: o.subtotal,
    delivery_fee: o.deliveryFee,
    total: o.total,
    created_at: o.createdAt,
    addresses_id: o.addressesId,
    addresses: o.address
      ? {
          id: o.address.id,
          user_id: o.address.userId,
          address_line: o.address.addressLine,
          city: o.address.city,
          region: o.address.region,
          instructions: o.address.instructions ?? "",
          is_default: o.address.isDefault,
          full_name: o.address.fullName,
          email: o.address.email,
          phone: o.address.phone,
        }
      : (null as any),
    order_items: (o.items ?? []).map((it: any) => ({
      id: it.id,
      order_id: it.orderId,
      product_name: it.productName,
      size_ml: it.sizeMl,
      quantity: it.quantity,
      price: it.price,
    })),
  })) as OrderWithItems[];
}

// !! Admin: change an order status (also appends a tracking row)
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<void> {
  await requireAdmin();
  const status = newStatus as OrderStatus;
  await db
    .update(orders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, orderId));
  await db.insert(orderTracking).values({ orderId, status });
}
