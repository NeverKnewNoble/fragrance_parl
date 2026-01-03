'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative w-full bg-black border-t border-white/10">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {/* Shop Column */}
          <div className="flex flex-col">
            <h3 className="mb-3 text-base font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Shop
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                Home
              </Link>
              <Link
                href="/category"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                Category
              </Link>
              <Link
                href="/my-orders"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                My Orders
              </Link>
            </nav>
          </div>

          {/* Support Column */}
          <div className="flex flex-col">
            <h3 className="mb-3 text-base font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Support
            </h3>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/my-account"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                My Account
              </Link>
              <Link
                href="/track-order"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                Track Order
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/70 transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Connect Column */}
          <div className="flex flex-col">
            <h3 className="mb-3 text-base font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:scale-110"
              >
                <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:scale-110"
              >
                <Facebook className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:scale-110"
              >
                <Twitter className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/50 uppercase tracking-[0.15em]">
              © {new Date().getFullYear()} Fragrance Parl. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/50">
              <Link
                href="/privacy"
                className="transition-colors duration-300 hover:text-[#D4AF37]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors duration-300 hover:text-[#D4AF37]"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

