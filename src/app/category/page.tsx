"use client";

import { ProductCard } from "@/components/ui/product-card";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useRef } from "react";
import { scrollLeft, scrollRight } from "@/utils/scrollFunctions";
import { handleAddToCart } from "@/utils/addToCart";
import { fragranceFamilies, productsByFamily } from "@/utils/sampleData";

export default function CategoryPage() {
  const [selectedFamily, setSelectedFamily] = useState("floral");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentProducts = productsByFamily[selectedFamily] || [];
  const selectedFamilyData = fragranceFamilies.find(
    (f) => f.id === selectedFamily
  );
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

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
                <div className={isFiltersOpen ? "space-y-8" : "space-y-0 mb-8"}>
                  {fragranceFamilies.map((family) => {
                    const Icon = family.icon;
                    const isSelected = selectedFamily === family.id;

                    return (
                      <button
                        key={family.id}
                        onClick={() => setSelectedFamily(family.id)}
                        className={`w-full text-left rounded-lg border-2 transition-all duration-300 p-5 hover:shadow-lg ${
                          isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              isSelected
                                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-xl font-bold mb-1 transition-colors duration-200 ${
                                isSelected ? "text-[#D4AF37]" : "text-gray-900"
                              }`}
                            >
                              {family.name}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                              {family.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {family.characteristics
                                .slice(0, 3)
                                .map((char) => (
                                  <span
                                    key={char}
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
                                      isSelected
                                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {char}
                                  </span>
                                ))}
                              {family.characteristics.length > 3 && (
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
                                    isSelected
                                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  +{family.characteristics.length - 3}
                                </span>
                              )}
                            </div>
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
                {selectedFamilyData && (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                        {selectedFamilyData.icon && (
                          <selectedFamilyData.icon className="h-5 w-5 text-[#D4AF37]" />
                        )}
                      </div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black">
                        {selectedFamilyData.name}
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                      {selectedFamilyData.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFamilyData.characteristics.map((char) => (
                        <span
                          key={char}
                          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </>
                )}
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
              {currentProducts.length > 0 ? (
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
                          size_ml={product.size_ml}
                          price={product.price}
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
                    No products found in this category.
                  </p>
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
