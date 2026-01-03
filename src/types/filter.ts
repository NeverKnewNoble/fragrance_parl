import { SimpleProduct } from '@/utils/sampleData';

//!! Filter configuration types
export interface FilterConfig {
  // Exact match filter (e.g., family)
  exactMatch?: {
    value: string;
    field: keyof SimpleProduct;
    allValue?: string; // Value that means "all" (e.g., 'all')
  };
  
  // Range filter (e.g., price)
  range?: {
    min: number;
    max: number;
    field: keyof SimpleProduct;
  };
  
  // Value match filter (e.g., size)
  valueMatch?: {
    value: string;
    field: keyof SimpleProduct;
    allValue?: string;
    valueMap?: Record<string, number>; // Map string values to actual values (e.g., '50' -> 50)
  };
}

