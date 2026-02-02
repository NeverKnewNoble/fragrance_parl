'use client';
 
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadFavorites, toggleFavorite, isFavorite } from '@/utils/favorites';
 
// Simple className utility function
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
}
 
export function ProductCard({
  title,
  price,
  product_variants,
  image,
  imageAlt,
  onAddToCart,
  className,
  productId,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const { user } = useAuth();

  //!! Check if product is in favorites on mount and when user changes
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

  // Get initial price from product_variants or fallback to price prop
  const initialPrice = product_variants?.[0]?.price || price || 0;

  // Format price as Ghanaian Cedi (only currency)
  const formattedPrice = `₵${initialPrice.toLocaleString('en-US')}`;

  // Compute product-level stock status from variants
  const allVariantsOutOfStock = product_variants?.length
    ? product_variants.every(v => v.is_out_of_stock)
    : false;
  const anyVariantRestocked = product_variants?.some(v => v.is_restocked) ?? false;
  const isAddToCartDisabled = allVariantsOutOfStock;

  // Handle add to cart click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id;
    if (!userId || !productId) return;
    
    const newFavoriteStatus = await toggleFavorite(userId, productId);
    setIsInFavorites(newFavoriteStatus);
  };

  // Generate product ID from title if not provided
  const id = productId || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className={cnUtil(
        'group relative flex flex-col rounded-4xl bg-linear-to-br from-gray-100 to-gray-50',
        'shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
        'transition-all duration-500 ease-out',
        'hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]',
        'hover:-translate-y-1',
        'overflow-hidden',
        'border border-gray-200/50',
        'w-full max-w-md',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container - Fills entire card */}
      <div className="relative w-full min-h-87.5 sm:min-h-100 md:min-h-125 overflow-hidden flex flex-col">
        {/* Stock Status Badges - Top Left */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {allVariantsOutOfStock && (
            <span className="inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          {anyVariantRestocked && !allVariantsOutOfStock && (
            <span className="inline-flex items-center rounded-full bg-[#D4AF37]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">
              Restocked
            </span>
          )}
        </div>

        {/* Favorite Button - Top Right */}
        <button
          onClick={handleToggleFavorite}
          className={cnUtil(
            'absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm shadow-lg transition-all duration-300',
            isInFavorites
              ? 'bg-red-500/90 text-white hover:bg-red-600 hover:scale-110'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
          )}
          aria-label={isInFavorites ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          <Heart className={cnUtil('h-5 w-5', isInFavorites && 'fill-current')} />
        </button>

        <Link href={`/product/${id}`} className="absolute inset-0 z-0">
          {image && !imageError ? (
            <>
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cnUtil(
                  'object-cover transition-transform duration-700 ease-out',
                  isHovered && 'scale-110'
                )}
                onError={() => setImageError(true)}
              />
              {/* Dark overlay gradient from bottom to middle */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-gray-300/50 flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">No Image</p>
              </div>
            </div>
          )}
        </Link>

        {/* Product Info Overlay - Positioned at bottom */}
        <div className="relative mt-auto flex flex-col px-4 sm:px-6 py-4 sm:py-5 z-10">
          {/* Title - Clickable link */}
          <Link href={`/product/${id}`}>
            <h3 className="mb-4 text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-1 hover:text-[#D4AF37] transition-colors duration-200 cursor-pointer">
              {title}
            </h3>
          </Link>

          {/* Price and Add to Cart Button */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <p className="text-xl sm:text-2xl font-extrabold text-white">
              {formattedPrice}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={cnUtil(
                'rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold',
                'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                'transition-all duration-300 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-gray-400/50',
                isAddToCartDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-900 cursor-pointer hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)] hover:scale-105 active:scale-100'
              )}
              aria-label={isAddToCartDisabled ? `${title} is out of stock` : `Add ${title} to cart`}
            >
              {isAddToCartDisabled ? 'Out of Stock' : 'Add to Cart +'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
 
/**
 *!! ProductCard Component
 * A modern profile-card style product component with large image,
 * verification badge, statistics, and prominent action button.
 *
 *!! Features:
 * - Large rounded image container
 * - Verification badge
 * - Clean statistics display
 * - Prominent Follow/CTA button
 * - Smooth hover animations
 * - Modern gradient background
 * 
 * !! Usage Example
 * <ProductCard
 *   title="Golden Bloom"
 *   size_ml={75}
 *   price={120}
 *   image="/images/golden_bloom.jpg"
 *   imageAlt="Golden Bloom"
 *   onAddToCart={() => console.log('Added to cart')}
 * />
 */