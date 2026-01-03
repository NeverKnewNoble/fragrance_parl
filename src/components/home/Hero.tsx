'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background image with parallax effect */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Luxury perfume bottles on a dark background"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-700 ease-out"
        />
        {/* Modern gradient overlays (slightly lighter to reveal image more) */}
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),transparent_30%,rgba(0,0,0,0.45))]" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-[#D4AF37]/8 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Modern eyebrow badge */}
          <div className="mb-6 animate-fade-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <span className="flex h-1.5 w-7 items-center justify-between">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="h-1 w-1 rounded-full bg-white/60" />
                <span className="h-1 w-1 rounded-full bg-white/30" />
              </span>
              Luxury Fragrances
            </p>
          </div>

          {/* Modern title with staggered animation */}
          <div className="space-y-5 animate-slide-up">
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Discover Your{' '}
              <span className="block mt-2 bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                Signature Scent
              </span>
            </h1>
            
            <p className="max-w-2xl text-sm text-white/80 sm:text-base md:text-lg leading-relaxed">
              Explore our curated collection of luxury fragrances, crafted for those
              who appreciate the finer things.
            </p>
          </div>

          {/* Modern CTA with enhanced styling */}
          <div className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in-delay">
            <Button
              href="/category"
              variant="primary"
              size="lg"
              showArrow
            >
              Explore Fragrances
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="h-8 w-px bg-linear-to-b from-[#D4AF37] to-transparent opacity-60" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
      `}</style>
    </section>
  );
}


