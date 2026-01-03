'use client';
 
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadFavorites, toggleFavorite, isFavorite } from '@/utils/favoritesStorage';
 
// Simple className utility function
function cnUtil(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
 
export interface ProductCardProps {
  title: string;
  size_ml: number;
  price: number;
  image?: string;
  imageAlt?: string;
  onAddToCart?: () => void;
  className?: string;
  productId?: string;
}
 
export function ProductCard({
  title,
  size_ml,
  price,
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
    const userId = user?.id;
    setIsInFavorites(isFavorite(userId, title));
  }, [user, title]);

  // Format price as Ghanaian Cedi (only currency)
  const formattedPrice = `₵${price.toLocaleString('en-US')}`;

  // Handle add to cart click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id;
    const updatedFavorites = toggleFavorite(userId, title);
    setIsInFavorites(updatedFavorites.includes(title));
  };

  // Generate product ID from title if not provided
  const id = productId || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className={cnUtil(
        'group relative flex flex-col rounded-[32px] bg-gradient-to-br from-gray-100 to-gray-50',
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
      <div className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden flex flex-col">
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
                className={cnUtil(
                  'object-cover transition-transform duration-700 ease-out',
                  isHovered && 'scale-110'
                )}
                onError={() => setImageError(true)}
              />
              {/* Dark overlay gradient from bottom to middle */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
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
            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-1 hover:text-[#D4AF37] transition-colors duration-200 cursor-pointer">
              {title}
            </h3>
          </Link>

          {/* Size */}
          <p className="mb-4 text-sm text-gray-200 leading-relaxed">
            {size_ml}ml
          </p>

          {/* Price and Add to Cart Button */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <p className="text-xl sm:text-2xl font-extrabold text-white">
              {formattedPrice}
            </p>
            <button
              onClick={handleAddToCart}
              className={cnUtil(
                'rounded-full bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-900',
                'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
                'transition-all duration-300 ease-out',
                'hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)]',
                'hover:scale-105',
                'active:scale-100',
                'focus:outline-none focus:ring-2 focus:ring-gray-400/50'
              )}
              aria-label={`Add ${title} to cart`}
            >
              Add to Cart +
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