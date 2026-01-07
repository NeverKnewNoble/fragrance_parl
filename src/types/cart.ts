import { SimpleProduct } from '@/types/simpleProduct';
import { getAllProductsWithLinkages } from '@/types/product';

//!! Cart item from database (cart_items table)
export interface CartItem {
  id: string;
  user_id: string;
  quantity: number;
  product_id: string;
  size_ml: number;
  products?: getAllProductsWithLinkages; // Product details from join
}

//!! Cart from database (cart table)
export interface Cart {
  id: string;
  user_id: string;
  cart_items: CartItem[];
  sub_total: number;
  delivery_fee: number;
  total: number;
  created_at?: string;
}

//!! Add to cart input
export type AddToCartInput = {
  product_id: string;
  quantity?: number;
  size_ml?: number;
};

//!! Update cart item input
export type UpdateCartItemInput = {
  id: string;
  quantity: number;
};

//!! Cart with product details (for UI)
export interface CartWithProductDetails extends CartItem {
  product: SimpleProduct;
}