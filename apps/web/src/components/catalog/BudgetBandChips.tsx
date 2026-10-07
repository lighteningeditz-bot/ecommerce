import React from "react";
import { Link } from "react-router-dom";
import { PRICE_BANDS, PriceBandKey } from "@kalakart/shared";
import { IndianRupee } from "lucide-react";

interface BudgetBandChipsProps {
  selectedBand?: PriceBandKey;
  onSelect?: (band: PriceBandKey | undefined) => void;
}

export const BudgetBandChips: React.FC<BudgetBandChipsProps> = ({ selectedBand, onSelect }) => {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-saffron-100 text-saffron-800">
            <IndianRupee className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold font-display text-stone-900">
            Shop by Budget
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Filter handcrafted gifts by your price ceiling
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {PRICE_BANDS.map((band) => {
          const isSelected = selectedBand === band.key;

          if (onSelect) {
            return (
              <button
                key={band.key}
                type="button"
                onClick={() => onSelect(isSelected ? undefined : (band.key as PriceBandKey))}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isSelected
                    ? "bg-terracotta-600 text-white shadow-md ring-2 ring-terracotta-400 ring-offset-1"
                    : "bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80"
                }`}
              >
                {band.label}
              </button>
            );
          }

          return (
            <Link
              key={band.key}
              to={`/shop?band=${band.key}`}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-white hover:bg-terracotta-50 text-stone-800 hover:text-terracotta-700 border border-stone-200/80 hover:border-terracotta-300 text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{band.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
