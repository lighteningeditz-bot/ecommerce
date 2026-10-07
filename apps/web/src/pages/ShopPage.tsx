import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product, PriceBandKey, SEEDED_CATEGORIES, MAX_LISTING_PRICE_INR } from "@kalakart/shared";
import { api } from "../lib/api";
import { ProductGrid } from "../components/catalog/ProductGrid";
import { FilterSidebar } from "../components/catalog/FilterSidebar";
import { Filter, X } from "lucide-react";

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug: routeCategorySlug } = useParams<{ categorySlug?: string }>();

  // Filter states
  const category = routeCategorySlug || searchParams.get("category") || undefined;
  const band = (searchParams.get("band") as PriceBandKey) || undefined;
  const q = searchParams.get("q") || undefined;
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = searchParams.get("maxPrice");
    return p ? Number(p) : MAX_LISTING_PRICE_INR;
  });
  const [sort, setSort] = useState<string>(() => searchParams.get("sort") || "newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync route param change
  useEffect(() => {
    if (routeCategorySlug) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("category", routeCategorySlug);
        return next;
      });
    }
  }, [routeCategorySlug, setSearchParams]);

  // Construct query string
  const queryParts: string[] = [];
  if (category) queryParts.push(`category=${encodeURIComponent(category)}`);
  if (band) queryParts.push(`band=${encodeURIComponent(band)}`);
  if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
  if (maxPrice < MAX_LISTING_PRICE_INR) queryParts.push(`maxPrice=${maxPrice}`);
  if (sort) queryParts.push(`sort=${sort}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  const { data, isLoading } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["products", queryString],
    queryFn: () => api.get<{ products: Product[]; total: number }>(`/products${queryString}`),
  });

  const products = data?.products || [];
  const currentCategoryObj = SEEDED_CATEGORIES.find((c) => c.slug === category);

  const handleCategoryChange = (newCat?: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newCat) next.set("category", newCat);
      else next.delete("category");
      return next;
    });
  };

  const handleBandChange = (newBand?: PriceBandKey) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newBand) next.set("band", newBand);
      else next.delete("band");
      return next;
    });
  };

  const handlePriceChange = (_min?: number, max?: number) => {
    if (max !== undefined) {
      setMaxPrice(max);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (max < MAX_LISTING_PRICE_INR) next.set("maxPrice", max.toString());
        else next.delete("maxPrice");
        return next;
      });
    }
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", newSort);
      return next;
    });
  };

  const handleReset = () => {
    setMaxPrice(MAX_LISTING_PRICE_INR);
    setSort("newest");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
              {currentCategoryObj ? currentCategoryObj.name : "All Handmade Crafts"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {q
                ? `Showing search results for "${q}"`
                : "100% authentic handicrafts, ethically made and priced under ₹2,500"}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 shadow-sm"
            >
              <Filter className="w-4 h-4 text-terracotta-600" />
              <span>Filters & Sort</span>
            </button>
            <span className="text-xs text-stone-500">{products.length} crafts</span>
          </div>
        </div>

        {/* Active Filter Pills */}
        {(category || band || q || maxPrice < MAX_LISTING_PRICE_INR) && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-xs text-stone-400 font-medium">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
                Category: {currentCategoryObj?.name || category}
                <button onClick={() => handleCategoryChange(undefined)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {band && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
                Band: {band}
                <button onClick={() => handleBandChange(undefined)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {q && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
                Search: "{q}"
                <button
                  onClick={() => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete("q");
                      return next;
                    });
                  }}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPrice < MAX_LISTING_PRICE_INR && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
                Under ₹{maxPrice}
                <button onClick={() => handlePriceChange(undefined, MAX_LISTING_PRICE_INR)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleReset}
              className="text-xs text-terracotta-700 hover:underline font-semibold ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-1">
          <FilterSidebar
            selectedCategory={category}
            selectedBand={band}
            maxPrice={maxPrice}
            sort={sort}
            onCategoryChange={handleCategoryChange}
            onBandChange={handleBandChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyTitle="No crafts matched your filter criteria"
            emptyDescription="Try selecting a different budget band or clearing some search keywords."
          />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
                <h3 className="font-bold text-stone-900 font-display">Filters & Sort</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                selectedCategory={category}
                selectedBand={band}
                maxPrice={maxPrice}
                sort={sort}
                onCategoryChange={(c) => {
                  handleCategoryChange(c);
                  setIsMobileFiltersOpen(false);
                }}
                onBandChange={(b) => {
                  handleBandChange(b);
                  setIsMobileFiltersOpen(false);
                }}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onReset={handleReset}
              />
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 rounded-xl bg-terracotta-600 text-white font-bold text-sm shadow-md mt-6"
            >
              Show {products.length} Crafts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
