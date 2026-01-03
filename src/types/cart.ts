import { SimpleProduct } from '@/utils/sampleData';

//!! Cart item interface
export interface CartItem {
  product: SimpleProduct;
  quantity: number;
  size_ml: number;
}

