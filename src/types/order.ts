import { SimpleProduct } from '@/utils/sampleData';
import { LucideIcon } from 'lucide-react';

//!! Order status type
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

//!! Order item interface
export interface OrderItem {
  product: SimpleProduct;
  quantity: number;
  size_ml: number;
}

//!! Order interface
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
}

//!! Status configuration interface
export interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}


export type OrderWithItems = {
  id: number;
  user_id: string | null;
  order_number: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: string;
  created_at: string;
  order_items: Array<{
    id: number;
    order_id: number;
    product_name: string;
    size_ml: number;
    quantity: number;
    price: number;
  }>;
};