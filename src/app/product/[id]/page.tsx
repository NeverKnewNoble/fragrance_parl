'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ProductCard } from '@/components/ui/product-card';
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { handleAddToCart } from '@/utils/addToCart';
import { getAllProductsAndLinkages } from '@/utils/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<{ ml: number; price: number; is_out_of_stock?: boolean; is_restocked?: boolean }>({ ml: 75, price: 120, is_out_of_stock: false, is_restocked: false });
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const allProducts = await getAllProductsAndLinkages();
        // console.log('URL Product ID:', productId);
        // console.log('Available Product IDs:', allProducts.map(p => ({ id: p.id, name: p.name })));
        
        const foundProduct = allProducts.find(p => 
          p.id === productId || 
          p.id?.toString() === productId || 
          p.slug === productId
        );
        // console.log('Found Product:', foundProduct);
        
        if (foundProduct) {
          // Transform product to match expected structure
          const transformedProduct = {
            id: foundProduct.id,
            title: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price,
            image: foundProduct.product_images?.find((img: any) => img.is_primary)?.image_url || foundProduct.product_images?.[0]?.image_url,
            family: foundProduct.fragrance_families?.[0]?.name || 'Unknown',
            sizes: foundProduct.product_variants?.map((variant: any) => ({
              ml: variant.size_ml,
              price: variant.price,
              is_out_of_stock: variant.is_out_of_stock ?? false,
              is_restocked: variant.is_restocked ?? false,
            })) || [{ ml: 50, price: foundProduct.price, is_out_of_stock: false, is_restocked: false }],
            notes: {
              top: foundProduct.product_notes?.filter((note: any) => note.note_type === 'top').map((note: any) => note.note_name) || [],
              middle: foundProduct.product_notes?.filter((note: any) => note.note_type === 'middle').map((note: any) => note.note_name) || [],
              base: foundProduct.product_notes?.filter((note: any) => note.note_type === 'base').map((note: any) => note.note_name) || []
            }
          };
          
          setProduct(transformedProduct);
          setSelectedSize(transformedProduct.sizes[0]);
          
          // Get related products (same fragrance family, excluding current product)
          const related = allProducts
            .filter(p => p.id !== productId && p.fragrance_families?.[0]?.name === foundProduct.fragrance_families?.[0]?.name)
            .slice(0, 3)
            .map(p => ({
              title: p.name,
              product_variants: p.product_variants,
              price: p.price,
              image: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url
            }));
          
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);


  //!! Validation checks for the product detail page
  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-colors duration-200 cursor-pointer"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
              {/* Family Badge and Stock Status */}
              <div className="mb-4 inline-flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                  {product.family}
                </span>
                {product.sizes.every((s: any) => s.is_out_of_stock) && (
                  <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Out of Stock
                  </span>
                )}
                {product.sizes.some((s: any) => s.is_restocked) && !product.sizes.every((s: any) => s.is_out_of_stock) && (
                  <span className="inline-flex items-center rounded-full bg-[#D4AF37] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Restocked
                  </span>
                )}
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
                        {product.notes.top.map((note: string) => (
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
                        {product.notes.middle.map((note: string) => (
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
                        {product.notes.base.map((note: string) => (
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
                  {product.sizes.map((size: any) => (
                    <button
                      key={size.ml}
                      onClick={() => !size.is_out_of_stock && setSelectedSize(size)}
                      disabled={size.is_out_of_stock}
                      className={`relative rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        size.is_out_of_stock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedSize.ml === size.ml
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] cursor-pointer'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      {size.ml}ml
                      {size.is_out_of_stock && (
                        <span className="absolute -top-3 -right-3 rounded-full bg-red-500 px-1.5 py-0.5 text-[7px] font-bold text-white whitespace-nowrap">
                          Out Of Stock
                        </span>
                      )}
                      {size.is_restocked && !size.is_out_of_stock && (
                        <span className="absolute -top-2 -right-2 rounded-full bg-[#D4AF37] px-1.5 py-0.5 text-[8px] font-bold text-white">
                          NEW
                        </span>
                      )}
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
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCartClick}
                  disabled={selectedSize.is_out_of_stock}
                  className={`group/button relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 text-sm font-semibold transition-transform duration-200 ${
                    selectedSize.is_out_of_stock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-linear-to-r from-[#D4AF37] via-[#f3de9e] to-[#D4AF37] text-black shadow-[0_22px_60px_rgba(212,175,55,0.45)] hover:-translate-y-px active:translate-y-0 cursor-pointer'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover/button:scale-110" />
                  {selectedSize.is_out_of_stock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
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
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-gray-300 cursor-pointer"
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
                    product_variants={relatedProduct.product_variants}
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

