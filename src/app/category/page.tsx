"use client";

import { ProductCard } from "@/components/ui/product-card";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flower2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { scrollLeft, scrollRight } from "@/utils/scrollFunctions";
import { handleAddToCart } from "@/utils/addToCart";
import { getAllProductsAndLinkages } from "@/utils/products";
import { fetchAllFragranceFamilies } from "@/utils/fragranceFamilies";
import { fragrance_family } from "@/types/family_fragrance";
import * as LucideIcons from "lucide-react";

export default function CategoryPage() {
  const [families, setFamilies] = useState<fragrance_family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentProducts = selectedFamily 
  ? products.filter((product: any) => product.family === selectedFamily)
  : products;
  const selectedFamilyData = families.find(
    (f) => f.name.toLowerCase() === selectedFamily
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedFamilies, fetchedProducts] = await Promise.all([
          fetchAllFragranceFamilies(),
          getAllProductsAndLinkages()
        ]);
        
        // console.log('Fetched families:', fetchedFamilies);
        // console.log('Fetched products:', fetchedProducts);
        
        setFamilies(fetchedFamilies);
        
        // Transform products to match expected structure
        const transformedProducts = fetchedProducts.map(product => ({
          title: product.name,
          product_variants: product.product_variants,
          image: product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url,
          family: (product.fragrance_families as any)?.name?.toLowerCase() || 'unknown',
          id: product.id,
          slug: product.slug,
          description: product.description
        }));
        
        // console.log('Transformed products:', transformedProducts);
        setProducts(transformedProducts);
        
        // Set initial family to the first available family
        if (fetchedFamilies.length > 0) {
          const firstFamily = fetchedFamilies[0].name.toLowerCase();
          setSelectedFamily(firstFamily);
          // console.log('Set selected family to:', firstFamily);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Flower2;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Flower2;
  };

  //!! Return the category page
  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white pt-24 pb-10 sm:pt-28 sm:pb-20 lg:pb-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col  gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Left Side - Fragrance Family Cards */}
            <div className="shrink-0 lg:w-80 lg:sticky lg:top-24 space-y-4 border border-gray-200 p-4">
              <div className="space-y-4 flex">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex w-full items-center justify-between mb-4 sm:mb-6 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  aria-label={isFiltersOpen ? "Hide filters" : "Show filters"}
                >
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                    Categories
                  </h3>
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isFiltersOpen
                    ? "max-h-500 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className={isFiltersOpen ? "space-y-4" : "space-y-0 mb-8"}>
                  {families.map((family) => {
                    const Icon = getIconComponent(family.icon);
                    const familyId = family.name.toLowerCase();
                    const isSelected = selectedFamily === familyId;

                    return (
                      <button
                        key={family.name}
                        onClick={() => setSelectedFamily(familyId)}
                        className={`w-full text-left rounded-lg border-2 transition-all duration-300 p-4 hover:shadow-lg ${
                          isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              isSelected
                                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-base font-bold transition-colors duration-200 ${
                                isSelected ? "text-[#D4AF37]" : "text-gray-900"
                              }`}
                            >
                              {family.name}
                            </h3>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Products Horizontal Scroll */}
            <div className="relative flex-1 -mx-4 sm:mx-0">
              {/* Section Header */}
              <div className="mb-6 px-4 sm:px-0">
                {selectedFamilyData && (() => {
                  const Icon = getIconComponent(selectedFamilyData.icon);
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black">
                          {selectedFamilyData.name}
                        </h2>
                      </div>
                    </>
                  );
                })()}
              </div>

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

              {/* Products Scroll Container */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                    <p className="mt-4 text-gray-500">Loading products...</p>
                  </div>
                </div>
              ) : currentProducts.length > 0 ? (
                <div className="overflow-hidden max-w-full sm:max-w-222 lg:max-w-237 px-4 sm:px-0">
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                  >
                    {currentProducts.map((product, index) => (
                      <div
                        key={`${product.id || product.title}-${index}`}
                        className="shrink-0"
                      >
                        <ProductCard
                          title={product.title}
                          product_variants={product.product_variants}
                          image={product.image}
                          productId={product.id}
                          onAddToCart={() => handleAddToCart({ product })}
                          className="w-70 sm:w-75"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <p className="text-lg font-medium text-gray-500">
                    {selectedFamily ? `No products found in ${selectedFamily} category.` : 'No products found.'}
                  </p>
                  {selectedFamily && (
                    <p className="mt-2 text-sm text-gray-400">
                      Try selecting a different category.
                    </p>
                  )}
                </div>
              )}
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
      <Footer />
    </div>
  );
}
