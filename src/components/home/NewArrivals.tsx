'use client';

import { ProductCard } from '@/components/ui/product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { scrollLeft, scrollRight } from '@/utils/scrollFunctions';
import { handleAddToCart } from '@/utils/addToCart';
import { getLatestProducts } from '@/utils/products';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 *  NewArrivals — "Latest Editions"
 *  An editorial drop. The section header is a numbered chapter mark,
 *  not a gradient banner. Cards drift horizontally on a velvet rail.
 */
export function NewArrivals() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const latestProducts = await getLatestProducts(8);
        const newArrivals = latestProducts.map((product) => ({
          title: product.name,
          product_variants: product.product_variants,
          price: product.price,
          image:
            product.product_images?.find((img: any) => img.is_primary)?.image_url ||
            product.product_images?.[0]?.image_url,
          id: product.id,
          slug: product.slug,
          description: product.description,
        }));
        setProducts(newArrivals);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <section
      id="new-arrivals"
      className="relative w-full bg-ink py-24 sm:py-32 grain"
    >
      {/* Faint horizontal hairline at top */}
      <div className="absolute top-0 left-0 right-0 hairline-faint" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        {/* Editorial chapter mark */}
        <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
          <div>
            <p className="label-spec text-gold mb-6">
              <span className="tick bg-gold/60" />
              Chapter&nbsp;II&nbsp;·&nbsp;Latest&nbsp;Editions
            </p>
            <h2 className="font-display text-vellum leading-[0.95] tracking-tight">
              <span className="block text-[clamp(2.5rem,7vw,6rem)]">
                Recent&nbsp;dossiers
              </span>
              <span className="block font-display-italic text-[clamp(2.5rem,7vw,6rem)] text-gold -mt-1">
                from the bench.
              </span>
            </h2>
          </div>

          {/* Side scroll controls + view-all */}
          <div className="hidden lg:flex flex-col items-end gap-6 shrink-0">
            <Link
              href="/category"
              className="group inline-flex items-center gap-3 label-spec text-bone hover:text-gold transition-colors duration-300"
            >
              <span className="relative">
                The&nbsp;Full&nbsp;Library
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              </span>
              <span className="h-px w-10 bg-gold/60" />
            </Link>
            <div className="flex items-center gap-2">
              <ScrollButton direction="left" onClick={() => scrollLeft(scrollContainerRef)} />
              <ScrollButton direction="right" onClick={() => scrollRight(scrollContainerRef)} />
            </div>
          </div>
        </div>

        {/* Loading or rail */}
        {loading ? (
          <LoadingRail />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative -mx-6 sm:-mx-10 lg:-mx-14 px-6 sm:px-10 lg:px-14">
            <div
              ref={scrollContainerRef}
              className="flex gap-7 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            >
              {products.map((product, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className="shrink-0 snap-start"
                >
                  <ProductCard
                    title={product.title}
                    product_variants={product.product_variants}
                    price={product.price}
                    image={product.image}
                    productId={product.id}
                    onAddToCart={() => handleAddToCart({ product })}
                    index={`Nº ${ROMAN[i] ?? String(i + 1).padStart(2, '0')}`}
                    className="w-[280px] sm:w-[320px]"
                  />
                </div>
              ))}
            </div>

            {/* Mobile/tablet scroll buttons (overlay) */}
            <div className="flex lg:hidden items-center justify-end gap-2 mt-6">
              <ScrollButton direction="left" onClick={() => scrollLeft(scrollContainerRef)} />
              <ScrollButton direction="right" onClick={() => scrollRight(scrollContainerRef)} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function ScrollButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      className="group h-11 w-11 flex items-center justify-center border border-gold/25 text-bone hover:text-gold hover:border-gold/60 transition-colors duration-300"
    >
      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
    </button>
  );
}

function LoadingRail() {
  return (
    <div className="flex gap-7 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-[280px] sm:w-[320px] aspect-[3/5] border border-gold/10 bg-smoke/40 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-gold/15 bg-smoke/30 px-8 py-16 text-center">
      <p className="font-display-italic text-bone text-2xl">
        New editions arrive shortly.
      </p>
      <p className="mt-3 label-spec text-shadow">
        The bench is composing.
      </p>
    </div>
  );
}
