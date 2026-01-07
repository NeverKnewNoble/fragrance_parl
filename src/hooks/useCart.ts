'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserCart, addToCart, updateCartItemQuantity, removeFromCartById, clearCart } from '@/utils/cartUtils';
import { Cart, AddToCartInput, UpdateCartItemInput } from '@/types/cart';

export function useCart() {
  const { user, loading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart data
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cartData = await getUserCart(user.id);
      setCart(cartData);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Add item to cart
  const addItem = useCallback(async (input: AddToCartInput) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await addToCart(user.id, input);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update item quantity
  const updateItem = useCallback(async (input: UpdateCartItemInput) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await updateCartItemQuantity(user.id, input);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromCartById(user.id, itemId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Clear cart
  const clearCartItems = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await clearCart(user.id);
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get cart count
  const getCartCount = useCallback(() => {
    if (!cart) return 0;
    return cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Get cart totals
  const getCartTotals = useCallback(() => {
    if (!cart) return { subtotal: 0, deliveryFee: 0, total: 0 };
    return {
      subtotal: cart.sub_total,
      deliveryFee: cart.delivery_fee,
      total: cart.total
    };
  }, [cart]);

  // Load cart on user change
  useEffect(() => {
    if (user && !loading) {
      loadCart();
    } else if (!user) {
      setCart(null);
    }
  }, [user, loading, loadCart]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart_updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart_updated', handleCartUpdate);
    };
  }, [loadCart]);

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCartItems,
    getCartCount,
    getCartTotals,
    refreshCart: loadCart
  };
}
