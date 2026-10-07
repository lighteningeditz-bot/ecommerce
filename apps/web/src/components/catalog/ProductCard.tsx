import React from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Check } from "lucide-react";
import { Product } from "@kalakart/shared";
import { PriceTag } from "../ui/PriceTag";
import { RatingStars } from "../ui/RatingStars";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, cart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart?.items.find((i) => i.product_id === product.id);
  const inCartQty = cartItem?.quantity || 0;

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]?.url
      : `https://picsum.photos/seed/${product.slug}/800/800`;

  const isOutOfStock = product.stock_qty <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-terracotta-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorited
            ? "bg-white/95 text-red-500 shadow-sm"
            : "bg-white/80 text-stone-500 hover:text-red-500 hover:bg-white shadow-sm"
        }`}
        aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500" : ""}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Budget Flag if under 199 */}
        {product.price_inr <= 199 && !isOutOfStock && (
          <span className="absolute bottom-2 left-2 bg-saffron-500 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            Budget Favorite
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium text-stone-600 uppercase tracking-wider">
            {product.category?.name || "Handmade"}
          </span>

          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 group-hover:text-terracotta-700 transition-colors">
              {product.title}
            </h3>
          </Link>

          <div className="mt-1.5 flex items-center">
            <RatingStars rating={product.avg_rating} count={product.review_count} />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <PriceTag price={Number(product.price_inr)} compareAtPrice={product.compare_at_price_inr ? Number(product.compare_at_price_inr) : null} size="sm" />

          {/* Quick Add To Cart */}
          <button
            onClick={() => addItem(product, 1)}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-all ${
              inCartQty > 0
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-600 hover:text-white"
            } disabled:opacity-40 disabled:pointer-events-none`}
            aria-label={`Add ${product.title} to cart`}
          >
            {inCartQty > 0 ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
