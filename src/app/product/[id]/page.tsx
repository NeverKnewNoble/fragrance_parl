'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ProductCard } from '@/components/ui/product-card';
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { handleAddToCart } from '@/utils/addToCart';
import { detailedProducts, relatedProducts } from '@/utils/sampleData';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = detailedProducts[productId];
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || { ml: 75, price: 120 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);


  //!! Validation checks for the product detail page
  if (!product) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link
              href="/category"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  //!! Handle add to cart functionality
  const handleAddToCartClick = () => {
    handleAddToCart({
      product: {
        id: product.id,
        title: product.title,
        size_ml: selectedSize.ml,
        price: selectedSize.price,
        image: product.image,
      },
      quantity,
      size_ml: selectedSize.ml,
    });
  };

  //!! Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} at Fragrance Parl`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };





  //!! Return the product detail page
  return (
    <div className="relative">
      <Navbar />
      <div className="relative w-full bg-white pt-24 pb-10 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 mb-16">
            {/* Left: Product Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-4xl bg-gray-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingCart className="h-20 w-20 text-gray-300" />
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Family Badge */}
              <div className="mb-4 inline-flex">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                  {product.family}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl font-extrabold text-gray-900">
                  ₵{selectedSize.price.toLocaleString('en-US')}
                </p>
                <p className="text-sm text-gray-500 mt-1">{selectedSize.ml}ml</p>
              </div>

              {/* Description */}
              <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
                {product.description}
              </p>

              {/* Fragrance Notes */}
              <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                  Fragrance Notes
                </h3>
                <div className="space-y-4">
                  {product.notes.top.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Top Notes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.notes.top.map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.notes.middle.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Heart Notes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.notes.middle.map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.notes.base.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Base Notes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.notes.base.map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.ml}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        selectedSize.ml === size.ml
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size.ml}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCartClick}
                  className="group/button relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] px-6 py-4 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover/button:scale-110" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                    isFavorite
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-gray-300"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={`${relatedProduct.title}-${index}`}
                    title={relatedProduct.title}
                    size_ml={relatedProduct.size_ml}
                    price={relatedProduct.price}
                    image={relatedProduct.image}
                    onAddToCart={() => handleAddToCart({ product: relatedProduct })}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

