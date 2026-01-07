//!! Cart utility functions using Supabase
import { 
  getOrCreateCart, 
  addToCart as addToCartService, 
  updateCartItem, 
  removeFromCart, 
  clearCart as clearCartService, 
  getCartCount 
} from '@/services/cartService';
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput } from '@/types/cart';

//!! Get user cart
export const getUserCart = async (userId: string): Promise<Cart> => {
  return await getOrCreateCart(userId);
};

//!! Add item to cart
export const addToCart = async (userId: string, input: AddToCartInput): Promise<Cart> => {
  const cart = await addToCartService(userId, input);
  
  // Dispatch event to update cart count in navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
  
  return cart;
};

//!! Update cart item quantity
export const updateCartItemQuantity = async (userId: string, input: UpdateCartItemInput): Promise<Cart> => {
  const cart = await updateCartItem(userId, input);
  
  // Dispatch event to update cart count in navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
  
  return cart;
};

//!! Remove item from cart
export const removeFromCartById = async (userId: string, itemId: string): Promise<Cart> => {
  const cart = await removeFromCart(userId, itemId);
  
  // Dispatch event to update cart count in navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
  
  return cart;
};

//!! Clear cart
export const clearCart = async (userId: string): Promise<void> => {
  await clearCartService(userId);
  
  // Dispatch event to update cart count in navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
};

//!! Get cart item count
export const getCartItemCount = async (userId: string): Promise<number> => {
  return await getCartCount(userId);
};

//!! Calculate cart totals (for display purposes)
export const calculateTotals = (cart: Cart) => {
  return {
    subtotal: cart.sub_total,
    deliveryFee: cart.delivery_fee,
    total: cart.total
  };
};
