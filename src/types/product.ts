export type Product = {
  id: string;
  name: string;
  description: string;
  fragranceFamily: string;
  sizes: number[];
  isActive: boolean;
  slug: string;
  images: string[];
};

export interface getAllProductsWithLinkages {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  is_active: boolean;
  fragrance_families: Array<{ 
    id: number; 
    name: string; 
    icon?: string 
  }>;
  product_images: Array<{
    id: number;
    product_id: string;
    image_url: string;
    is_primary: boolean;
  }>;
  product_notes: Array<{
    id: number;
    product_id: string;
    note_name: string;
    note_type: string;
  }>;
  product_variants: Array<{
    id: number;
    product_id: string;
    size_ml: number;
    price: number;
    is_out_of_stock?: boolean;
    is_restocked?: boolean;
  }>;
  created_at: string;
}

export type ProductVariant = {
  size_ml: number;
  price: number;
  stock_quantity: number;
  is_out_of_stock?: boolean;
  is_restocked?: boolean;
};

export type ProductNote = {
  note_name: string;
  note_type: "top" | "middle" | "base";
};

export type FragranceFamily = {
  id: number;
  name: string;
  icon?: string;
};

export type Props = {
  onProductCreated?: () => void;
};