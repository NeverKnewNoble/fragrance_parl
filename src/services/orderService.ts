import { supabase } from '@/lib/supabase/client';
import { OrderStatus } from '@/types/order';
import { Address } from '@/types/address';
import { Cart } from '@/types/cart';

//!! Order status type for database
export type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

//!! Order from database (order table)
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

//!! Order item from database (order_items table)
export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  size_ml: number;
  price: number;
  quantity: number;
  created_at?: string;
}

//!! Order tracking from database (order_tracking table)
export interface OrderTracking {
  id: string;
  order_id: string;
  status: OrderStatusType;
  updated_at: string;
}

//!! Order with items and tracking
export interface OrderWithDetails extends Order {
  order_items: OrderItem[];
  order_tracking: OrderTracking[];
}

//!! Create order input
export interface CreateOrderInput {
  user_id: string;
  cart: Cart;
  address_id: string;
}

//!! Generate unique order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

//!! Create order from cart
export const createOrder = async (input: CreateOrderInput): Promise<OrderWithDetails> => {
  try {
    const { user_id, cart, address_id } = input;
    const orderNumber = generateOrderNumber();

    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
      .from('order')
      .insert({
        user_id,
        order_number: orderNumber,
        status: 'pending',
        subtotal: cart.sub_total,
        delivery_fee: cart.delivery_fee,
        total: cart.total
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cart.cart_items.map(item => {
      // Find the variant that matches the cart item size
      const variant = item.products?.product_variants?.find((v: any) => v.size_ml === item.size_ml);
      return {
        order_id: order.id,
        product_name: item.products?.name || 'Unknown Product',
        size_ml: item.size_ml,
        price: variant?.price || 0,
        quantity: item.quantity
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Create initial order tracking
    const { error: trackingError } = await supabase
      .from('order_tracking')
      .insert({
        order_id: order.id,
        status: 'pending'
      });

    if (trackingError) throw trackingError;

    // Get the complete order with details
    const orderDetails = await getOrderWithDetails(order.id);

    // Clear the cart after successful order creation
    await clearCartAfterOrder(user_id);

    return orderDetails;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

//!! Get order with details
export const getOrderWithDetails = async (orderId: string): Promise<OrderWithDetails> => {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('order')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (itemsError) throw itemsError;

    // Get order tracking
    const { data: orderTracking, error: trackingError } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('updated_at', { ascending: true });

    if (trackingError) throw trackingError;

    return {
      ...order,
      order_items: orderItems || [],
      order_tracking: orderTracking || []
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
};

//!! Get user orders
export const getUserOrders = async (userId: string): Promise<OrderWithDetails[]> => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('order')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Get details for each order
    const ordersWithDetails = await Promise.all(
      (orders || []).map(order => getOrderWithDetails(order.id))
    );

    return ordersWithDetails;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

//!! Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatusType): Promise<void> => {
  try {
    // Update order status
    const { error: orderError } = await supabase
      .from('order')
      .update({ status })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // Add tracking entry
    const { error: trackingError } = await supabase
      .from('order_tracking')
      .insert({
        order_id: orderId,
        status
      });

    if (trackingError) throw trackingError;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

//!! Get order tracking history
export const getOrderTracking = async (orderId: string): Promise<OrderTracking[]> => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('updated_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting order tracking:', error);
    throw error;
  }
};

//!! Clear cart after order (helper function)
const clearCartAfterOrder = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    // Reset cart totals
    await supabase
      .from('cart')
      .update({
        sub_total: 0,
        delivery_fee: 0,
        total: 0
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error clearing cart after order:', error);
    throw error;
  }
};
