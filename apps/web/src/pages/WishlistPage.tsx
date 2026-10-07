import { useWishlist } from "../hooks/useWishlist";
import { ProductCard } from "../components/catalog/ProductCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Heart } from "lucide-react";

export const WishlistPage: React.FC = () => {
  const { wishlist, isLoading } = useWishlist();

  const products = wishlist.map((item) => item.product).filter(Boolean);

  if (products.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={<Heart className="w-8 h-8 text-red-500" />}
          title="Your Wishlist is Empty"
          description="Save handmade items you admire and revisit them anytime."
          actionText="Browse Handcrafted Crafts"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-4 border-b border-stone-200 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
          Saved Crafts Wishlist ({products.length})
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Items you've bookmarked from rural artisan workshops.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
