'use client';

import { ProductCard } from '@/components/ui/product-card';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { scrollLeft, scrollRight } from '@/utils/scrollFunctions';
import { handleAddToCart } from '@/utils/addToCart';
import { newArrivalsProducts } from '@/utils/sampleData';

export function NewArrivals() {
  //!! Scroll container reference
  const scrollContainerRef = useRef<HTMLDivElement>(null);



  
  
  //!! Return the new arrivals section
  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24">
      {/* Decorative gradient overlay */}
      {/* <div className="absolute inset-0 bg-linear-to-r from-[#D4AF37]/3 via-transparent to-transparent pointer-events-none" /> */}
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Left Side - Title Section */}
          <div className="shrink-0 lg:w-80 lg:sticky lg:top-24">
            <div className="mb-4 inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                <span className="flex h-1.5 w-7 items-center justify-between">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]/30" />
                </span>
                Latest Collection
              </span>
            </div>
            
            <h2 className="mb-3 sm:mb-4 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
              New{' '}
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                Arrivals
              </span>
            </h2>
            
            <p className="mb-4 sm:mb-6 text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
              Discover our latest fragrance collections, carefully curated for the modern connoisseur.
            </p>

            {/* View All Link */}
            <a
              href="/category"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-colors duration-300 hover:text-[#D4AF37]"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right Side - Products Horizontal Scroll */}
          <div className="relative flex-1 -mx-4 sm:mx-0">
            {/* Navigation Buttons - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:block absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-4 lg:-translate-x-6">
              <button
                onClick={() => scrollLeft(scrollContainerRef)}
                className="rounded-full bg-white p-2.5 sm:p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              </button>
            </div>
            <div className="hidden sm:block absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 lg:translate-x-6">
              <button
                onClick={() => scrollRight(scrollContainerRef)}
                className="rounded-full bg-white p-2.5 sm:p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              </button>
            </div>

            {/* Products Scroll Container - Shows only 3 cards */}
            <div className="overflow-hidden max-w-full sm:max-w-222 lg:max-w-237 px-4 sm:px-0">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              >
                {newArrivalsProducts.map((product, index) => (
                  <div
                    key={`${product.title}-${index}`}
                    className="shrink-0"
                  >
                    <ProductCard
                      title={product.title}
                      size_ml={product.size_ml}
                      price={product.price}
                      image={product.image}
                      onAddToCart={() => handleAddToCart({ product })}
                      className="w-70 sm:w-75"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

