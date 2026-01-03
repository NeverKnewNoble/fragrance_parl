import { SimpleProduct } from '@/utils/sampleData';

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

