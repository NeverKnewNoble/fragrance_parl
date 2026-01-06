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


export type ProductVariant = {
  size_ml: number;
  price: number;
  stock_quantity: number;
};

export type ProductNote = {
  note_name: string;
  note_type: 'top' | 'middle' | 'base';
};

export type FragranceFamily = {
  id: number;
  name: string;
  icon?: string;
};

export type Props = {
  onProductCreated?: () => void;
};


// export type ProductWith 