import { Product } from '@/types/product';

const STORAGE_KEY = 'products';

export const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch (error) {
    console.error('Error parsing stored products:', error);
    return [];
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export const addProduct = (product: Product): Product[] => {
  const products = loadProducts();
  const updated = [product, ...products];
  saveProducts(updated);
  return updated;
};

export const updateProduct = (productId: string, patch: Partial<Product>): Product[] => {
  const products = loadProducts();
  const updated = products.map((p) => (p.id === productId ? { ...p, ...patch } : p));
  saveProducts(updated);
  return updated;
};

export const deleteProduct = (productId: string): Product[] => {
  const products = loadProducts();
  const updated = products.filter((p) => p.id !== productId);
  saveProducts(updated);
  return updated;
};
