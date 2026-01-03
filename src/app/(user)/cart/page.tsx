'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '@/types/cart';
import {
  loadCart,
  removeFromCart,
  updateCartItemQuantity,
  calculateCartTotals,
} from '@/utils/cartStorage';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  //!! Load cart items
  useEffect(() => {
    if (user && !loading) {
      const cart = loadCart(user.id);
      setCartItems(cart);
    }
  }, [user, loading]);

  //!! Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  //!! Handle remove item
  const handleRemoveItem = (productTitle: string, size_ml: number) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    const updatedCart = removeFromCart(user.id, productTitle, size_ml);
    setCartItems(updatedCart);
    setIsUpdating(false);
  };

  //!! Handle quantity change
  const handleQuantityChange = (productTitle: string, size_ml: number, newQuantity: number) => {
    if (!user || isUpdating || newQuantity < 1) return;
    setIsUpdating(true);
    const updatedCart = updateCartItemQuantity(user.id, productTitle, size_ml, newQuantity);
    setCartItems(updatedCart);
    setIsUpdating(false);
  };

  //!! Calculate totals
  const { subtotal, shipping, total } = calculateCartTotals(cartItems);

  //!! Handle checkout
  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    router.push('/checkout');
  };

  //!! Show loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  //!! Return the cart page
  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
                Shopping{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                  Cart
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {cartItems.length > 0
                ? `You have ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart`
                : 'Your cart is empty'}
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.product.title}-${item.size_ml}-${index}`}
                    className="rounded-[32px] border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.product.id || item.product.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-lg overflow-hidden bg-gray-200 shrink-0 group"
                      >
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.id || item.product.title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block mb-2"
                        >
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 hover:text-[#D4AF37] transition-colors duration-200">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-4">{item.size_ml}ml</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 rounded-lg border-2 border-gray-200">
                            <button
                              onClick={() => handleQuantityChange(item.product.title, item.size_ml, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                              className="flex h-10 w-10 items-center justify-center text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center text-base font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.title, item.size_ml, item.quantity + 1)}
                              disabled={isUpdating}
                              className="flex h-10 w-10 items-center justify-center text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product.title, item.size_ml)}
                            disabled={isUpdating}
                            className="flex items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Remove ${item.product.title} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end justify-between sm:justify-start">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                          ₵{(item.product.price * item.quantity).toLocaleString('en-US')}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₵{item.product.price.toLocaleString('en-US')} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-[32px] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h2>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span className="font-semibold">₵{subtotal.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Shipping:</span>
                      <span className="font-semibold">₵{shipping.toLocaleString('en-US')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                        <span>Total:</span>
                        <span>₵{total.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isUpdating || cartItems.length === 0}
                    className="group w-full flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-4 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>

                  {/* Continue Shopping Link */}
                  <Link
                    href="/category"
                    className="mt-4 block w-full text-center text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-[#D4AF37]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <ShoppingCart className="h-12 w-12 text-[#D4AF37]/40" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="mb-6 text-sm text-gray-600 max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                href="/category"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

