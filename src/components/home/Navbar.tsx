'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingBag, ChevronDown, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut, isCurrentUserAdmin } from '@/lib/auth';
import { getCartItemCount } from '@/utils/cartUtils';

/**
 *  Navbar — "Maison de Nuit"
 *  An editorial header that reads as a press masthead. No pill, no sparkle.
 *  - Brand sits on the left in display serif (italic), lowered into the page.
 *  - The middle nav uses tiny mono labels with hairline separators.
 *  - Cart, favorites, account icons collapse into a slim right cluster.
 *  - On scroll the bar contracts, gold rule beneath darkens.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      } catch {
        setCartCount(0);
      }
    };

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
    return () => window.removeEventListener('cart_updated', handleCartUpdated);
  }, [user, loading]);

  // Track scroll position to contract the bar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const getUserName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-ink/85 backdrop-blur-xl border-b border-gold/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
          <nav
            className={`relative flex items-center justify-between transition-all duration-500 ease-out ${
              scrolled ? 'h-14' : 'h-20'
            }`}
          >
            {/* Brand */}
            <Link
              href="/"
              className="group flex items-baseline gap-3 select-none"
              aria-label="Fragrance Parl — Home"
            >
              <span
                className="font-display-italic text-[26px] sm:text-[30px] leading-none text-vellum transition-colors duration-300 group-hover:text-gold"
              >
                Fragrance&nbsp;Parl
              </span>
              <span className="hidden md:inline label-spec text-shadow group-hover:text-gold/80 transition-colors duration-300">
                Maison&nbsp;·&nbsp;Accra
              </span>
            </Link>

            {/* Desktop center nav — three editorial categories */}
            <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              <NavLink href="/" label="Maison" />
              <NavLink href="/category" label="The&nbsp;Library" />
              <NavLink href="/my_orders" label="Dossier" />
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-1 sm:gap-2">
              {!loading && user && (
                <>
                  {/* Favorites */}
                  <Link
                    href="/favorites"
                    aria-label="Favorites"
                    className="hidden sm:inline-flex h-10 w-10 items-center justify-center text-bone transition-colors duration-300 hover:text-gold"
                  >
                    <Heart className="h-[18px] w-[18px]" strokeWidth={1.4} />
                  </Link>

                  {/* Bag */}
                  <Link
                    href="/cart"
                    aria-label="Bag"
                    className="relative inline-flex h-10 w-10 items-center justify-center text-bone transition-colors duration-300 hover:text-gold"
                  >
                    <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    {cartCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 font-mono-spec text-[9px] leading-none text-gold">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User menu */}
                  <div className="relative hidden sm:block" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((s) => !s)}
                      className="group inline-flex items-center gap-2 px-3 py-2 label-spec text-bone transition-colors duration-300 hover:text-gold"
                    >
                      <span className="max-w-[8rem] truncate normal-case tracking-[0.18em]">
                        {getUserName()}
                      </span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-300 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`}
                        strokeWidth={1.6}
                      />
                    </button>

                    {/* Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-3 w-56 border border-gold/25 bg-ink/95 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.7)]">
                        <div className="px-4 pt-4 pb-3 border-b border-gold/15">
                          <p className="label-spec text-shadow">Account</p>
                          <p className="mt-1 font-display-italic text-vellum text-lg leading-tight truncate">
                            {getUserName()}
                          </p>
                        </div>
                        <div className="py-2">
                          <DropLink href="/my_profile" icon={User} label="Profile" onClick={() => setIsUserMenuOpen(false)} />
                          {isAdmin && (
                            <DropLink href="/dashboard" icon={Menu} label="Dashboard" onClick={() => setIsUserMenuOpen(false)} />
                          )}
                          <DropLink href="/favorites" icon={Heart} label="Favorites" onClick={() => setIsUserMenuOpen(false)} />
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 border-t border-gold/15 label-spec text-bone transition-colors duration-300 hover:text-ember"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.4} />
                          Sign&nbsp;Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!loading && !user && (
                <div className="hidden sm:flex items-center gap-1">
                  <Link
                    href="/login"
                    className="px-3 py-2 label-spec text-bone transition-colors duration-300 hover:text-gold"
                  >
                    Sign&nbsp;In
                  </Link>
                  <span className="text-shadow/40">/</span>
                  <Link
                    href="/signup"
                    className="px-3 py-2 label-spec text-gold transition-colors duration-300 hover:text-vellum"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                type="button"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setIsOpen((p) => !p)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center text-bone hover:text-gold transition-colors duration-300"
              >
                {isOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Hairline gold rule beneath nav (visible on scroll) */}
        <div
          className={`h-px w-full transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'linear-gradient(to right, transparent, var(--gold) 20%, var(--gold) 80%, transparent)' }}
        />
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative h-full flex flex-col">
            <div className="h-20" />
            <div className="flex-1 overflow-y-auto px-8 pb-12">
              <p className="label-spec text-gold mb-10">Index</p>
              <nav className="flex flex-col gap-7">
                <MobileLink href="/" label="Maison" onClick={() => setIsOpen(false)} index="I" />
                <MobileLink href="/category" label="The Library" onClick={() => setIsOpen(false)} index="II" />
                <MobileLink href="/my_orders" label="Dossier" onClick={() => setIsOpen(false)} index="III" />
                <MobileLink href="/favorites" label="Favorites" onClick={() => setIsOpen(false)} index="IV" />
                <MobileLink href="/cart" label="Bag" onClick={() => setIsOpen(false)} index="V" badge={cartCount > 0 ? cartCount : undefined} />
                {isAdmin && <MobileLink href="/dashboard" label="Dashboard" onClick={() => setIsOpen(false)} index="VI" />}
              </nav>

              <div className="mt-16 pt-8 border-t border-gold/20">
                {!loading && user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="label-spec text-shadow">Signed in as</p>
                      <p className="font-display-italic text-2xl text-vellum mt-1">
                        {getUserName()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="label-spec text-ember hover:text-vellum transition-colors"
                    >
                      Sign&nbsp;Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="label-spec text-bone hover:text-gold transition-colors"
                    >
                      Sign&nbsp;In
                    </Link>
                    <span className="text-shadow/30">·</span>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="label-spec text-gold hover:text-vellum transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              <p className="label-spec text-shadow mt-16">Est. MMXXIV — Accra</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Internal sub-components ──────────────────────────────── */

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative label-spec text-bone transition-colors duration-300 hover:text-gold"
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
      <span
        aria-hidden
        className="absolute -bottom-2 left-0 right-0 h-px origin-center scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
      />
    </Link>
  );
}

function DropLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 label-spec text-bone transition-colors duration-300 hover:text-gold hover:bg-smoke/40"
    >
      <Icon className="h-4 w-4" strokeWidth={1.4} />
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  index,
  onClick,
  badge,
}: {
  href: string;
  label: string;
  index: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-baseline justify-between gap-6 border-b border-gold/10 pb-3"
    >
      <span className="flex items-baseline gap-5">
        <span className="font-mono-spec text-[10px] text-gold/60">{index}</span>
        <span className="font-display text-[2.5rem] leading-[1.1] text-vellum group-hover:text-gold transition-colors duration-300">
          {label}
        </span>
      </span>
      {badge !== undefined && (
        <span className="font-mono-spec text-xs text-gold">{badge > 99 ? '99+' : badge}</span>
      )}
    </Link>
  );
}
