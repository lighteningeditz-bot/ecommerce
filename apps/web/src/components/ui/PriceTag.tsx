import React from "react";
import { formatINR } from "../../lib/format";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}

export const PriceTag: React.FC<PriceTagProps> = ({ price, compareAtPrice, size = "md" }) => {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const percentOff = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: { current: "text-sm font-semibold", compare: "text-xs", badge: "text-[10px] px-1.5 py-0.2" },
    md: { current: "text-lg font-bold", compare: "text-sm", badge: "text-xs px-2 py-0.5" },
    lg: { current: "text-2xl font-bold", compare: "text-base", badge: "text-xs px-2.5 py-0.5" },
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-stone-900 ${sizeClasses[size].current}`}>
        {formatINR(price)}
      </span>

      {hasDiscount && (
        <>
          <span className={`text-stone-400 line-through ${sizeClasses[size].compare}`}>
            {formatINR(compareAtPrice)}
          </span>
          <span
            className={`font-semibold bg-emerald-100 text-emerald-800 rounded-md ${sizeClasses[size].badge}`}
          >
            {percentOff}% off
          </span>
        </>
      )}
    </div>
  );
};
