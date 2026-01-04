//!! Handle add to cart functionality
import { supabase } from '@/lib/supabase/client';
import { addToCart } from '@/utils/cartStorage';
import { AddToCartInput } from '@/types/cart';

export const handleAddToCart = async ({ product, quantity = 1, size_ml }: AddToCartInput) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    window.location.href = '/login';
    return;
  }

  addToCart(userId, product, size_ml ?? product.size_ml, quantity);
};