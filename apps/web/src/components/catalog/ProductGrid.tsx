import React from "react";
import { Product } from "@kalakart/shared";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = "No crafts found",
  emptyDescription = "Try adjusting your price range, category, or search filters.",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <ProductCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText="View All Crafts"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
