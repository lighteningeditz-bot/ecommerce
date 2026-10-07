import React from "react";
import { PRICE_BANDS, PriceBandKey, SEEDED_CATEGORIES, MAX_LISTING_PRICE_INR } from "@kalakart/shared";
import { formatINR } from "../../lib/format";
import { RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  selectedCategory?: string;
  selectedBand?: PriceBandKey;
  minPrice?: number;
  maxPrice?: number;
  sort: string;
  onCategoryChange: (slug?: string) => void;
  onBandChange: (band?: PriceBandKey) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  selectedBand,
  minPrice,
  maxPrice = MAX_LISTING_PRICE_INR,
  sort,
  onCategoryChange,
  onBandChange,
  onPriceChange,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-6 shadow-sm">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <h3 className="font-bold font-display text-stone-900 text-base">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-terracotta-600 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:ring-terracotta-500 focus:border-terracotta-500 py-2 px-3"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      {/* Budget Bands */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Budget Bands
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => onBandChange(selectedBand === b.key ? undefined : (b.key as PriceBandKey))}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                selectedBand === b.key
                  ? "bg-terracotta-600 text-white shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Maximum Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          <span>Max Price</span>
          <span className="text-terracotta-700 font-extrabold text-sm">{formatINR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="49"
          max={MAX_LISTING_PRICE_INR}
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-terracotta-600"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
          <span>₹49</span>
          <span>{formatINR(MAX_LISTING_PRICE_INR)} (Max Cap)</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onCategoryChange(undefined)}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors font-medium ${
              !selectedCategory
                ? "bg-terracotta-50 text-terracotta-700 font-bold"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            All Categories
          </button>
          {SEEDED_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => onCategoryChange(selectedCategory === c.slug ? undefined : c.slug)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors font-medium ${
                selectedCategory === c.slug
                  ? "bg-terracotta-50 text-terracotta-700 font-bold"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
