import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Product } from "@kalakart/shared";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "../ui/Skeleton";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: Product[];
  isLoading?: boolean;
}

export const ProductRail: React.FC<ProductRailProps> = ({
  title,
  subtitle,
  viewAllHref,
  products,
  isLoading = false,
}) => {
  return (
    <section className="py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-stone-500 mt-1">{subtitle}</p>}
        </div>

        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {isLoading
          ? [1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-shrink-0 w-44 sm:w-60">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-44 sm:w-60">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
};
