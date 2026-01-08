import { SimpleProduct } from '@/types/simpleProduct';
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
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  addresses_id: string | null;
  addresses: {
    id: string;
    user_id: string;
    address_line: string;
    city: string;
    region: string;
    instructions: string;
    is_default: boolean;
    full_name: string;
    email: string;
    phone: string;
  };
  order_items: Array<{
    id: string;
    order_id: string;
    product_name: string;
    size_ml: number;
    quantity: number;
    price: number;
  }>;
};