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
      addresses_id,
      addresses!addresses_id (
        id,
        user_id,
        address_line,
        city,
        region,
        instructions,
        is_default,
        full_name,
        email,
        phone
      ),
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
    // console.error("Error fetching orders:", error);
    throw error;
  }

  // console.log("Orders data:", data); // Debug log to see what we're getting
  return (data || []) as unknown as OrderWithItems[];
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
