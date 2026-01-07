import { supabase } from '@/lib/supabase/client';
import { Cart, CartItem, AddToCartInput, UpdateCartItemInput, CartWithProductDetails } from '@/types/cart';
import { getAllProductsWithLinkages } from '@/types/product';

//!! Get or create user cart
export const getOrCreateCart = async (userId: string): Promise<Cart> => {
  try {
    // First try to get existing cart (without cart_items field)
    const { data: existingCart, error: cartError } = await supabase
      .from('cart')
      .select('id, user_id, sub_total, delivery_fee, total, created_at')
      .eq('user_id', userId)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      throw cartError;
    }

    if (existingCart) {
      // Get cart items with product details
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            slug,
            is_active,
            product_variants (
              size_ml,
              price
            ),
            product_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq('user_id', userId);

      if (itemsError) throw itemsError;

      return {
        ...existingCart,
        cart_items: cartItems || []
      };
    }

    // Create new cart (handle cart_items constraint)
    let newCart;
    
    // Try different approaches for the cart_items constraint
    try {
      // Method 1: Try with properly formatted empty array
      const { data, error } = await supabase
        .from('cart')
        .insert({
          user_id: userId,
          cart_items: '{}', // Try empty array in PostgreSQL format
          sub_total: 0,
          delivery_fee: 0,
          total: 0
        })
        .select('id, user_id, sub_total, delivery_fee, total, created_at')
        .single();
      
      if (error) throw error;
      newCart = data;
    } catch (insertError1) {
      try {
        // Method 2: Try with null (might work if constraint allows it)
        const { data, error } = await supabase
          .from('cart')
          .insert({
            user_id: userId,
            cart_items: null,
            sub_total: 0,
            delivery_fee: 0,
            total: 0
          })
          .select('id, user_id, sub_total, delivery_fee, total, created_at')
          .single();
        
        if (error) throw error;
        newCart = data;
      } catch (insertError2) {
        try {
          // Method 3: Create without cart_items, then update with PostgreSQL array format
          const { data, error } = await supabase
            .from('cart')
            .insert({
              user_id: userId,
              sub_total: 0,
              delivery_fee: 0,
              total: 0
            })
            .select('id, user_id, sub_total, delivery_fee, total, created_at')
            .single();
          
          if (error) throw error;
          
          // Update with PostgreSQL empty array format
          const { data: updatedCart, error: updateError } = await supabase
            .from('cart')
            .update({ cart_items: '{}' })
            .eq('id', data.id)
            .select('id, user_id, sub_total, delivery_fee, total, created_at')
            .single();
          
          if (updateError) throw updateError;
          newCart = updatedCart;
        } catch (insertError3) {
          // Method 4: Last resort - create without cart_items and skip the update
          const { data, error } = await supabase
            .from('cart')
            .insert({
              user_id: userId,
              sub_total: 0,
              delivery_fee: 0,
              total: 0
            })
            .select('id, user_id, sub_total, delivery_fee, total, created_at')
            .single();
          
          if (error) throw error;
          newCart = data;
          console.warn('Cart created without cart_items field - this may cause issues later');
        }
      }
    }

    return {
      ...newCart,
      cart_items: []
    };
  } catch (error) {
    console.error('Error getting or creating cart:', error);
    throw error;
  }
};

//!! Add item to cart
export const addToCart = async (userId: string, input: AddToCartInput): Promise<Cart> => {
  try {
    const cart = await getOrCreateCart(userId);

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', input.product_id)
      .eq('size_ml', input.size_ml || 50)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingItem) {
      // Update quantity if item exists
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + (input.quantity || 1)
        })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: input.product_id,
          quantity: input.quantity || 1,
          size_ml: input.size_ml || 50
        });

      if (insertError) throw insertError;
    }

    // Recalculate cart totals
    return await recalculateCartTotals(userId);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

//!! Update cart item quantity
export const updateCartItem = async (userId: string, input: UpdateCartItemInput): Promise<Cart> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity: Math.max(1, input.quantity)
      })
      .eq('id', input.id)
      .eq('user_id', userId);

    if (error) throw error;

    return await recalculateCartTotals(userId);
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

//!! Remove item from cart
export const removeFromCart = async (userId: string, itemId: string): Promise<Cart> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;

    return await recalculateCartTotals(userId);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

//!! Clear cart
export const clearCart = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    // Reset cart totals
    await supabase
      .from('cart')
      .update({
        sub_total: 0,
        delivery_fee: 0,
        total: 0
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

//!! Recalculate cart totals
const recalculateCartTotals = async (userId: string): Promise<Cart> => {
  try {
    // Get all cart items with product details
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          is_active,
          product_variants (
            size_ml,
            price
          ),
          product_images (
            image_url,
            is_primary
          )
        )
      `)
      .eq('user_id', userId);

    if (itemsError) throw itemsError;

    // Calculate totals based on product variants
    const subtotal = (cartItems || []).reduce((sum, item) => {
      // Find the variant that matches the cart item size
      const variant = item.products?.product_variants?.find((v: any) => v.size_ml === item.size_ml);
      const price = variant?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    
    const deliveryFee = subtotal > 0 ? 15 : 0;
    const total = subtotal + deliveryFee;

    // Update cart totals
    const { data: updatedCart, error: updateError } = await supabase
      .from('cart')
      .update({
        sub_total: subtotal,
        delivery_fee: deliveryFee,
        total: total
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      ...updatedCart,
      cart_items: cartItems || []
    };
  } catch (error) {
    console.error('Error recalculating cart totals:', error);
    throw error;
  }
};

//!! Get cart count
export const getCartCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};
