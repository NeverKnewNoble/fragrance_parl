//!! Handle add to cart functionality
import { supabase } from '@/lib/supabase/client';
import { addToCart as addToCartService } from '@/services/cartService';
import { AddToCartInput } from '@/types/cart';

// Handle both old interface (with product object) and new interface (with product_id)
export const handleAddToCart = async (input: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    window.location.href = '/login';
    return;
  }

  try {
    // Handle old interface where product object is passed
    let addToCartInput: AddToCartInput;
    
    if (input.product && input.product.id) {
      // Old interface: { product: { id, ... }, quantity, size_ml }
      addToCartInput = {
        product_id: input.product.id,
        quantity: input.quantity || 1,
        size_ml: input.size_ml || input.product.size_ml || 50
      };
    } else {
      // New interface: { product_id, quantity, size_ml }
      addToCartInput = {
        product_id: input.product_id,
        quantity: input.quantity || 1,
        size_ml: input.size_ml || 50
      };
    }

    await addToCartService(userId, addToCartInput);
    
    // Dispatch event to update cart count in navbar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart_updated'));
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    // You could show a toast notification here
    throw error;
  }
};