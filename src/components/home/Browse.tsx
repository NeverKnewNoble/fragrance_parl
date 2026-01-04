"use client";

import { ProductCard } from "@/components/ui/product-card";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { handleAddToCart } from "@/utils/addToCart";
import { browseProducts, fragranceFamiliesFilter } from "@/utils/sampleData";
import { filterProducts } from "@/utils/filterProducts";

export function Browse() {
  //!! Filter states
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSize, setSelectedSize] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const PRODUCTS_PER_PAGE = 9; // 3 rows × 3 columns

  //!! Filter products based on selected filters
  const filteredProducts = filterProducts(browseProducts, {
    exactMatch: {
      value: selectedFamily,
      field: "family",
      allValue: "all",
    },
    range: {
      min: priceRange[0],
      max: priceRange[1],
      field: "price",
    },
    valueMatch: {
      value: selectedSize,
      field: "size_ml",
      allValue: "all",
      valueMap: {
        "50": 50,
        "75": 75,
        "100": 100,
      },
    },
  });

  //!! Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  //!! Reset to page 1 when filters change
  const handleFilterChange = (filterSetter: (value: any) => void, value: any) => {
    filterSetter(value);
    setCurrentPage(1);
  };


  
  //!! Return the browse section
  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Left Sidebar - Filters */}
          <aside className="shrink-0 w-full lg:w-80 lg:sticky lg:top-24 border border-gray-200 rounded-lg p-4 sm:p-6">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex w-full items-center justify-between mb-4 sm:mb-6 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              aria-label={isFiltersOpen ? "Hide filters" : "Show filters"}
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                Filters
              </h3>
              {isFiltersOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              )}
            </button>

            {/* Collapsible Filter Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isFiltersOpen
                  ? "max-h-500 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className={isFiltersOpen ? "space-y-8" : "space-y-0"}>
                {/* Fragrance Family Filter */}
                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                    Fragrance Family
                  </h3>
                  <div className="flex flex-col gap-3">
                    {fragranceFamiliesFilter.map((family) => {
                      const Icon = family.icon;
                      return (
                        <label
                          key={family.value}
                          className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="fragrance-family"
                            value={family.value}
                            checked={selectedFamily === family.value}
                            onChange={(e) => handleFilterChange(setSelectedFamily, e.target.value)}
                            className="h-4 w-4 cursor-pointer border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]/50"
                          />
                          {Icon && (
                            <Icon className="h-4 w-4 text-gray-600 transition-colors duration-200 group-hover:text-[#D4AF37]" />
                          )}
                          <span className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
                            {family.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                    Price Range
                  </h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => {
                        handleFilterChange(setPriceRange, [priceRange[0], Number(e.target.value)]);
                      }}
                      className="price-range-slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 transition-all duration-200 hover:bg-gray-300"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-600">
                      <span>₵{priceRange[0]}</span>
                      <span>₵{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Bottle Size Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-gray-900">
                    Bottle Size
                  </h3>
                  <div className="flex flex-col gap-3">
                    {["all", "50", "75", "100"].map((size) => (
                      <label
                        key={size}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="bottle-size"
                          value={size}
                          checked={selectedSize === size}
                          onChange={(e) => handleFilterChange(setSelectedSize, e.target.value)}
                          className="h-4 w-4 cursor-pointer border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]/50"
                        />
                        <span className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-gray-900">
                          {size === "all" ? "All Sizes" : `${size}ml`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content - Product Grid */}
          <div className="flex-1 w-full">
            {/* Section Title */}
            <h2 className="mb-6 sm:mb-8 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
              Our{" "}
              <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                Collection
              </span>
            </h2>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={`${product.title}-${index}`}
                    title={product.title}
                    size_ml={product.size_ml}
                    price={product.price}
                    image={product.image}
                    onAddToCart={() => handleAddToCart({ product })}
                    className="w-full"
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-10 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? "bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white shadow-lg shadow-[#D4AF37]/30"
                              : "border border-gray-300 bg-white text-gray-700 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-gray-500">
                  No products found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedFamily("all");
                    setPriceRange([0, 1000]);
                    setSelectedSize("all");
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-sm font-semibold text-[#D4AF37] transition-colors duration-200 hover:text-[#D4AF37]/80"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles for range slider */}
      <style jsx>{`
        .price-range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          transition: all 0.2s ease-out;
        }

        .price-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
        }

        .price-range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          transition: all 0.2s ease-out;
        }

        .price-range-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
        }

        .price-range-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
        }

        .price-range-slider::-moz-range-track {
          height: 6px;
          background: #e5e7eb;
          border-radius: 9999px;
        }
      `}</style>
    </section>
  );
}
