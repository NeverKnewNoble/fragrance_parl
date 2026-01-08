'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { ProductCard } from '@/components/ui/product-card';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Trash2 } from 'lucide-react';
import { handleAddToCart } from '@/utils/addToCart';
import { loadFavorites, removeFavorite } from '@/utils/favorites';
import { getAllProductsAndLinkages } from '@/utils/products';


export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  //!! Load favorites and products from database
  useEffect(() => {
    const loadData = async () => {
      if (user && !loading) {
        try {
          // Load all products
          const products = await getAllProductsAndLinkages();
          setAllProducts(products);
          
          // Load user favorites
          const userFavorites = await loadFavorites(user.id);
          setFavorites(userFavorites);
          
          // Filter products that are in favorites
          const favoriteProductIds = userFavorites.map(fav => fav.product_id);
          const filteredProducts = products.filter(product => 
            favoriteProductIds.includes(product.id)
          );
          setFavoriteProducts(filteredProducts);
        } catch (error) {
          console.error('Failed to load data:', error);
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };
    
    loadData();
  }, [user, loading]);

  //!! Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  //!! Remove from favorites
  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;
    
    try {
      const success = await removeFavorite(user.id, productId);
      if (success) {
        // Update local state
        const updatedFavorites = favorites.filter(fav => fav.product_id !== productId);
        setFavorites(updatedFavorites);
        
        // Update favorite products
        const updatedProducts = favoriteProducts.filter(product => product.id !== productId);
        setFavoriteProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };


  //!! Show loading state
  if (loading || isLoadingFavorites) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading favorites...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  
  //!! Return the favorites page
  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
                My{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                  Favorites
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {favoriteProducts.length > 0
                ? `You have ${favoriteProducts.length} favorite ${favoriteProducts.length === 1 ? 'item' : 'items'}`
                : 'Your favorite fragrances will appear here'}
            </p>
          </div>

          {/* Favorites Grid */}
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="relative group">
                  <ProductCard
                    title={product.name}
                    product_variants={product.product_variants}
                    image={product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url}
                    productId={product.id}
                    onAddToCart={() => handleAddToCart({ product_id: product.id })}
                    className="w-full"
                  />
                  {/* Remove from favorites button */}
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-red-500 shadow-lg transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${product.name} from favorites`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Heart className="h-12 w-12 text-[#D4AF37]/40" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">No favorites yet</h2>
              <p className="mb-6 text-sm text-gray-600 max-w-md">
                Start adding your favorite fragrances by clicking the heart icon on any product
              </p>
              <a
                href="/category"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

