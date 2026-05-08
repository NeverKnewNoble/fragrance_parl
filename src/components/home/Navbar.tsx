'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, ChevronDown, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut, isCurrentUserAdmin } from '@/lib/auth';
import { getCartItemCount } from '@/utils/cartUtils';
import { CartItem } from '@/types/cart';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user || loading) {
      setCartCount(0);
      setIsAdmin(false);
      return;
    }

    const updateCartCount = async () => {
      try {
        const count = await getCartItemCount(user.id);
        setCartCount(count);
      } catch (error) {
        console.error('Error getting cart count:', error);
        setCartCount(0);
      }
    };

    // Check if user is admin
    const checkAdminRole = async () => {
      try {
        const adminFlag = await isCurrentUserAdmin();
        setIsAdmin(adminFlag);
      } catch {
        setIsAdmin(false);
      }
    };

    updateCartCount();
    checkAdminRole();

    const handleCartUpdated = () => updateCartCount();

    window.addEventListener('cart_updated', handleCartUpdated);

    return () => {
      window.removeEventListener('cart_updated', handleCartUpdated);
    };
  }, [user, loading]);


  //!! Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);


  //!! Get user display name
  const getUserName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  //!! Handle logout
  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };



  
  //!! Return the navbar
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex w-full justify-center pointer-events-none px-3 sm:px-4">
      {/* Pill-shaped navbar container */}
      <nav className="flex w-full max-w-200 items-center justify-between gap-3 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl px-4 sm:px-5 py-2.5  mx-auto pointer-events-auto">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center rounded-full px-2 sm:px-3 py-1.5 transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-[0.24em] text-white transition-colors duration-200 group-hover:text-[#D4AF37] uppercase">
            Fragrance Parl
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <div className="hidden items-center gap-7 text-[11px] font-bold text-white/70 md:flex">
          <Link
            href="/"
            className="relative pb-0.5 transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
          >
            HOME
            <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#D4AF37] transition-transform duration-200 hover:scale-x-100" />
          </Link>
          <Link
            href="/category"
            className="relative pb-0.5 transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
          >
            CATEGORY
          </Link>
          <Link
            href="/my_orders"
            className="relative pb-0.5 transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
          >
            MY ORDERS
          </Link>
        </div>

        {/* Auth buttons + mobile menu toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop: Show cart + user menu when logged in, or login/signup when not */}
          {!loading && (
            <div className="hidden items-center gap-3 sm:flex">
              {user ? (
                <>
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/85 shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0] hover:-translate-y-px active:translate-y-0 cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount >= 1 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold leading-none text-black shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User dropdown menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/85 shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0] hover:-translate-y-px active:translate-y-0 cursor-pointer"
                    >
                      <span className="max-w-25 truncate">{getUserName()}</span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/15 bg-black/95 backdrop-blur-xl px-2 py-2 shadow-[0_22px_60px_rgba(0,0,0,0.9)]">
                        <Link
                          href="/my_profile"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-[#D4AF37] cursor-pointer"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-[#D4AF37] cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Menu className="h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/favorites"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-[#D4AF37] cursor-pointer"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Favorites
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-red-400 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-white/16 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/85 shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0] hover:-translate-y-px active:translate-y-0 cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_rgba(212,175,55,0.55)] transition-all duration-200 hover:bg-[#e3c55d] hover:-translate-y-px active:translate-y-0 cursor-pointer"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white/85 shadow-[0_10px_26px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-[#D4AF37]/70 hover:text-[#f6e6b0] md:hidden cursor-pointer"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-18 left-0 right-0 z-40 px-3 sm:px-4 md:hidden pointer-events-none">
          <div className="mx-auto w-full max-w-200 rounded-3xl border border-white/15 bg-black/85 px-4 py-4 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl pointer-events-auto">
            <div className="flex flex-col gap-3 text-sm text-white/85">
              <Link
                href="/"
                className="rounded-2xl px-3 py-2 font-semibold tracking-[0.18em] uppercase hover:bg-white/5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="rounded-2xl px-3 py-2 font-semibold tracking-[0.18em] uppercase hover:bg-white/5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/category"
                className="rounded-2xl px-3 py-2 font-semibold tracking-[0.18em] uppercase hover:bg-white/5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Category
              </Link>
              <Link
                href="/my_orders"
                className="rounded-2xl px-3 py-2 font-semibold tracking-[0.18em] uppercase hover:bg-white/5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                My Orders
              </Link>
            </div>

            {/* Mobile auth section */}
            {!loading && (
              <div className="mt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 transition-all duration-200 hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0]"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="flex-1">Cart</span>
                      {cartCount >= 1 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold leading-none text-black">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/25 bg-white/5 px-3 py-2">
                      <span className="text-[11px] font-semibold text-white/85 truncate">
                        {getUserName()}
                      </span>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl px-3 py-1.5 text-[11px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href="/login"
                      className="flex-1 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 transition-all duration-200 hover:border-[#D4AF37]/70 hover:bg-white/10 hover:text-[#f6e6b0]"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_rgba(212,175,55,0.55)] transition-all duration-200 hover:bg-[#e3c55d]"
                      onClick={() => setIsOpen(false)}
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

