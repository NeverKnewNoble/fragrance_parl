'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toggleFavorite, isFavorite } from '@/utils/favorites';

function cnUtil(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface ProductCardProps {
  title: string;
  price?: number;
  product_variants?: Array<{
    size_ml: number;
    price: number;
    is_out_of_stock?: boolean;
    is_restocked?: boolean;
  }>;
  image?: string;
  imageAlt?: string;
  onAddToCart?: () => void;
  className?: string;
  productId?: string;
  /**
   * Editorial index shown top-left ("I.", "II.", "Nº 03"). Optional.
   */
  index?: string;
}

/**
 *  ProductCard — Specimen plate
 *  A perfume-bottle specimen plate. Tall portrait. Matte ink frame.
 *  - Index numeral upper-left.
 *  - Image plate centered, with soft amber wash behind it.
 *  - Title in display italic, volume sizes as small-caps mono spec.
 *  - "Add" is an underlined editorial link, not a pill.
 *  - Heart sits unobtrusively in the upper-right; gold when filled.
 */
export function ProductCard({
  title,
  price,
  product_variants,
  image,
  imageAlt,
  onAddToCart,
  className,
  productId,
  index,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const userId = user?.id;
      if (userId && productId) {
        const favoriteStatus = await isFavorite(userId, productId);
        setIsInFavorites(favoriteStatus);
      }
    };
    checkFavoriteStatus();
  }, [user, productId]);

  const initialPrice = product_variants?.[0]?.price || price || 0;
  const formattedPrice = `₵${initialPrice.toLocaleString('en-US')}`;

  // Distinct ml sizes (sorted ascending) for spec line
  const sizes = Array.from(
    new Set((product_variants ?? []).map((v) => v.size_ml).filter(Boolean))
  ).sort((a, b) => a - b);

  const allOut = product_variants?.length
    ? product_variants.every((v) => v.is_out_of_stock)
    : false;
  const anyRestocked = product_variants?.some((v) => v.is_restocked) ?? false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && !allOut) onAddToCart();
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id;
    if (!userId || !productId) return;
    const newFav = await toggleFavorite(userId, productId);
    setIsInFavorites(newFav);
  };

  const id = productId || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <article
      className={cnUtil(
        'group relative flex flex-col bg-smoke/60 border border-gold/15 transition-all duration-500 ease-out',
        'hover:border-gold/40',
        'overflow-hidden',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Index numeral, top-left */}
      {index && (
        <span className="absolute top-4 left-4 z-20 font-mono-spec text-[10px] text-gold/70 tracking-[0.18em]">
          {index}
        </span>
      )}

      {/* Stock status badge */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button
          onClick={handleToggleFavorite}
          aria-label={isInFavorites ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          className={cnUtil(
            'flex h-9 w-9 items-center justify-center transition-colors duration-300',
            isInFavorites ? 'text-gold' : 'text-bone/70 hover:text-gold'
          )}
        >
          <Heart
            className={cnUtil('h-4 w-4', isInFavorites && 'fill-current')}
            strokeWidth={1.4}
          />
        </button>
        {allOut && (
          <span className="font-mono-spec text-[9px] text-ember tracking-[0.2em] uppercase">
            Sold&nbsp;Out
          </span>
        )}
        {anyRestocked && !allOut && (
          <span className="font-mono-spec text-[9px] text-gold tracking-[0.2em] uppercase">
            Restocked
          </span>
        )}
      </div>

      {/* Image plate — portrait aspect */}
      <Link
        href={`/product/${id}`}
        className="relative block aspect-[3/4] w-full bg-ink/50 overflow-hidden"
      >
        {/* Soft amber halo behind bottle */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-radial pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.10), transparent 65%)',
          }}
        />
        {image && !imageError ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className={cnUtil(
              'object-cover transition-transform duration-[1200ms] ease-out',
              'grayscale-[10%] contrast-[1.04]',
              isHovered && 'scale-[1.04] grayscale-0'
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display-italic text-bone/40 text-sm">No specimen</p>
          </div>
        )}

        {/* Bottom dark wash for legibility of any future hover info */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />

        {/* Hover micro-caption — slides up */}
        <div
          className={cnUtil(
            'absolute inset-x-4 bottom-4 z-10 flex items-center justify-between transition-all duration-500',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          <span className="label-spec text-vellum">View&nbsp;Plate</span>
          <span className="h-px w-10 bg-gold" />
        </div>
      </Link>

      {/* Card body — type only, no images */}
      <div className="relative flex flex-col gap-4 px-5 py-6 border-t border-gold/15">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/product/${id}`} className="min-w-0">
            <h3 className="font-display text-vellum text-2xl leading-[1.1] tracking-tight transition-colors duration-300 group-hover:text-gold truncate">
              {title}
            </h3>
          </Link>
          <p className="font-mono-spec text-xs text-gold whitespace-nowrap pt-1">
            {formattedPrice}
          </p>
        </div>

        {/* Spec line: sizes available */}
        {sizes.length > 0 && (
          <p className="label-spec text-shadow">
            {sizes.map((s) => `${s}ml`).join(' · ')}
          </p>
        )}

        {/* Action row */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={allOut}
            aria-label={allOut ? `${title} is sold out` : `Add ${title} to bag`}
            className={cnUtil(
              'group/btn relative inline-flex items-center gap-2 label-spec transition-colors duration-300',
              allOut
                ? 'text-shadow/50 cursor-not-allowed'
                : 'text-vellum hover:text-gold cursor-pointer'
            )}
          >
            <span className="relative">
              {allOut ? 'Sold Out' : 'Add to Bag'}
              {!allOut && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold scale-x-0 origin-left transition-transform duration-500 group-hover/btn:scale-x-100" />
              )}
            </span>
            {!allOut && (
              <span aria-hidden className="font-mono-spec text-gold">+</span>
            )}
          </button>

          <Link
            href={`/product/${id}`}
            className="label-spec text-shadow hover:text-gold transition-colors duration-300"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
