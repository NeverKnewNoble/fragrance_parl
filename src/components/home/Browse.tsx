'use client';

import { ProductCard } from '@/components/ui/product-card';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flower2 } from 'lucide-react';
import { handleAddToCart } from '@/utils/addToCart';
import { getAllProductsAndLinkages } from '@/utils/products';
import { fetchAllFragranceFamilies } from '@/utils/fragranceFamilies';
import type { fragrance_family } from '@/types/family_fragrance';
import * as LucideIcons from 'lucide-react';

const PAGE_SIZE = 9;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

/**
 *  Browse — "The Library"
 *  A library of editions. Slim left rail of olfactory families and a
 *  price band; right column holds the grid. The active filter is
 *  shown above the grid as an editorial title.
 */
export function Browse() {
  const [families, setFamilies] = useState<fragrance_family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedFamilies, fetchedProducts] = await Promise.all([
          fetchAllFragranceFamilies(),
          getAllProductsAndLinkages(),
        ]);

        setFamilies(fetchedFamilies);

        const transformed = fetchedProducts.map((product) => ({
          title: product.name,
          product_variants: product.product_variants,
          price: product.price,
          image:
            product.product_images?.find((img: any) => img.is_primary)?.image_url ||
            product.product_images?.[0]?.image_url,
          family:
            (product.fragrance_families as any)?.[0]?.name?.toLowerCase() ||
            (product.fragrance_families as any)?.name?.toLowerCase() ||
            'unknown',
          id: product.id,
          slug: product.slug,
          description: product.description,
        }));

        setProducts(transformed);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Flower2;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Flower2;
  };

  // Filter
  const filtered = products.filter((p) => {
    if (selectedFamily !== 'all') {
      const fam = p.family?.toLowerCase() || 'unknown';
      if (fam !== selectedFamily) return false;
    }
    const pr = p.price || 0;
    if (pr < priceRange[0] || pr > priceRange[1]) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const current = filtered.slice(start, start + PAGE_SIZE);

  const setFilter = <T,>(setter: (v: T) => void, v: T) => {
    setter(v);
    setCurrentPage(1);
  };

  const activeFamilyName =
    selectedFamily === 'all'
      ? 'The Library'
      : families.find((f) => f.name.toLowerCase() === selectedFamily)?.name ?? 'Edition';

  return (
    <section className="relative w-full bg-ink py-24 sm:py-32 grain">
      {/* Top hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gold/25" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="label-spec text-gold mb-6">
            <span className="tick bg-gold/60" />
            Chapter&nbsp;V&nbsp;·&nbsp;The&nbsp;Library
          </p>
          <h2 className="font-display text-vellum leading-[0.95] tracking-tight">
            <span className="block text-[clamp(2.5rem,7vw,6rem)]">Currently in</span>
            <span className="block font-display-italic text-[clamp(2.5rem,7vw,6rem)] text-gold -mt-1 transition-all duration-500">
              {activeFamilyName.toLowerCase()}.
            </span>
          </h2>
          <p className="mt-6 font-mono-spec text-xs text-shadow">
            {filtered.length}&nbsp;
            {filtered.length === 1 ? 'edition' : 'editions'}
            &nbsp;·&nbsp;Page&nbsp;{currentPage}&nbsp;of&nbsp;{totalPages}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left rail — olfactory family + price */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              {/* Olfactory family */}
              <div className="mb-12">
                <p className="label-spec text-gold mb-6">Olfactory&nbsp;family</p>
                <ul className="flex flex-col">
                  <FamilyRow
                    label="All editions"
                    icon={Flower2}
                    active={selectedFamily === 'all'}
                    onClick={() => setFilter(setSelectedFamily, 'all')}
                  />
                  {families.map((family) => {
                    const Icon = getIconComponent(family.icon);
                    const value = family.name.toLowerCase();
                    return (
                      <FamilyRow
                        key={family.name}
                        label={family.name}
                        icon={Icon}
                        active={selectedFamily === value}
                        onClick={() => setFilter(setSelectedFamily, value)}
                      />
                    );
                  })}
                </ul>
              </div>

              {/* Price */}
              <div>
                <p className="label-spec text-gold mb-6">Price&nbsp;range</p>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setFilter(setPriceRange, [priceRange[0], Number(e.target.value)])
                  }
                  className="price-range-slider w-full appearance-none bg-transparent cursor-pointer"
                />
                <div className="mt-4 flex items-center justify-between font-mono-spec text-xs text-bone">
                  <span>₵{priceRange[0]}</span>
                  <span className="h-px w-10 bg-gold/60" />
                  <span className="text-gold">₵{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right column — grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/5] border border-gold/10 bg-smoke/40 animate-pulse"
                  />
                ))}
              </div>
            ) : current.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {current.map((p, i) => (
                    <ProductCard
                      key={`${p.id}-${i}`}
                      title={p.title}
                      product_variants={p.product_variants}
                      price={p.price}
                      image={p.image}
                      productId={p.id}
                      onAddToCart={() => handleAddToCart({ product: p })}
                      index={`Nº ${ROMAN[(start + i) % ROMAN.length] ?? String(start + i + 1).padStart(2, '0')}`}
                      className="w-full"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-2">
                    <PageButton
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      ariaLabel="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    </PageButton>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const show =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      if (!show) {
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 font-mono-spec text-xs text-shadow">
                              ···
                            </span>
                          );
                        }
                        return null;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-11 h-11 px-4 font-mono-spec text-xs transition-colors duration-300 ${
                            currentPage === page
                              ? 'bg-gold text-ink'
                              : 'border border-gold/25 text-bone hover:text-gold hover:border-gold/60'
                          }`}
                        >
                          {String(page).padStart(2, '0')}
                        </button>
                      );
                    })}

                    <PageButton
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      ariaLabel="Next page"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                    </PageButton>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-gold/15 bg-smoke/30 px-8 py-20 text-center">
                <p className="font-display-italic text-bone text-2xl">
                  Nothing in this family yet.
                </p>
                <button
                  onClick={() => {
                    setSelectedFamily('all');
                    setPriceRange([0, 1000]);
                    setCurrentPage(1);
                  }}
                  className="mt-6 label-spec text-gold hover:text-vellum transition-colors duration-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function FamilyRow({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-4 py-3 border-b border-gold/10 last:border-0 transition-colors duration-300 ${
          active ? 'text-gold' : 'text-bone hover:text-vellum'
        }`}
      >
        {/* Indicator */}
        <span
          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
            active ? 'bg-gold scale-100' : 'bg-shadow/40 scale-75 group-hover:bg-bone'
          }`}
        />
        <Icon
          className={`h-3.5 w-3.5 transition-colors duration-300 ${
            active ? 'text-gold' : 'text-shadow group-hover:text-bone'
          }`}
          strokeWidth={1.4}
        />
        <span className="flex-1 text-left font-display-italic text-base">
          {label}
        </span>
      </button>
    </li>
  );
}

function PageButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="h-11 w-11 flex items-center justify-center border border-gold/25 text-bone hover:text-gold hover:border-gold/60 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-bone disabled:hover:border-gold/25"
    >
      {children}
    </button>
  );
}
