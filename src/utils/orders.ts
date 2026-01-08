import { supabase } from "@/lib/supabase";
import { OrderWithItems } from "@/types/order";

export type { OrderWithItems };


export async function fetchAllOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      order_number,
      status,
      subtotal,
      delivery_fee,
      total,
      created_at,
      order_items (
        id,
        order_id,
        product_name,
        size_ml,
        quantity,
        price
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  // Return data as-is since order_items already has the correct structure
  return (data || []) as OrderWithItems[];
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
