import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductDetail, Review } from "@kalakart/shared";
import { api } from "../lib/api";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { ImageGallery } from "../components/product/ImageGallery";
import { PriceTag } from "../components/ui/PriceTag";
import { RatingStars } from "../components/ui/RatingStars";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { ProductQAPanel } from "../components/product/ProductQAPanel";
import { ReviewList } from "../components/product/ReviewList";
import { ReviewSummaryCard } from "../components/product/ReviewSummaryCard";
import { ReviewForm } from "../components/product/ReviewForm";
import { ProductRail } from "../components/catalog/ProductRail";
import { Heart, Truck, ShieldCheck, RefreshCcw, Sparkles } from "lucide-react";

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading, error } = useQuery<ProductDetail>({
    queryKey: ["product", slug],
    queryFn: () => api.get<ProductDetail>(`/products/${slug}`),
    enabled: !!slug,
  });

  const { data: reviewsData } = useQuery<{ reviews: Review[]; total: number }>({
    queryKey: ["reviews", slug],
    queryFn: () => api.get<{ reviews: Review[]; total: number }>(`/products/${slug}/reviews`),
    enabled: !!slug,
  });

  const reviews = reviewsData?.reviews || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-600">Loading artisanal craft...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900 mb-2">Craft not found</h2>
        <p className="text-stone-500 text-sm mb-6">This craft may have been moved or is currently sold out.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock_qty <= 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(product, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    await addItem(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
        <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/category/${product.category.slug}`} className="hover:text-stone-900 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-900 truncate max-w-[200px] sm:max-w-none">{product.title}</span>
      </nav>

      {/* Main Product Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-6">
          <ImageGallery images={product.images} productTitle={product.title} />
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold tracking-wider text-terracotta-700 uppercase bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-200/60">
                {product.category?.name || "Authentic Craft"}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {isOutOfStock ? "Sold Out" : `${product.stock_qty} available`}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <RatingStars rating={product.avg_rating} count={product.review_count} size="md" />
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">100% Verified Purchases</span>
            </div>

            {/* Price Tag & Affordability Assurance */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <PriceTag
                  price={Number(product.price_inr)}
                  compareAtPrice={product.compare_at_price_inr ? Number(product.compare_at_price_inr) : null}
                  size="lg"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Inclusive of all taxes • Fair pay guarantee
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block text-[11px] font-bold text-saffron-800 bg-saffron-100 px-2.5 py-1 rounded-full">
                  Guaranteed Under ₹2,500
                </span>
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Highlights List */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Artisanal Highlights
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600">
                  {product.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purchase CTA Controls */}
            <div className="pt-4 border-t border-stone-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-700">Quantity:</span>
                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={Math.min(product.stock_qty, 10)}
                  onChange={setQuantity}
                  disabled={isOutOfStock}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 font-bold text-sm shadow-md"
                  isLoading={isAdding}
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 font-bold text-sm shadow-md text-stone-900"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                    isFavorited
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-stone-200 bg-white text-stone-600 hover:text-red-500 hover:border-red-200"
                  }`}
                  aria-label={isFavorited ? "Saved to wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-3 text-center text-[11px] text-stone-600">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center">
                <Truck className="w-4 h-4 text-terracotta-600 mb-1" />
                <span>Free Ship &gt; ₹499</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center">
                <RefreshCcw className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Cash on Delivery</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mb-1" />
                <span>7-Day Easy Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Maker Story */}
      <section className="my-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Maker Story */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-terracotta-600" />
            <h3 className="text-lg font-bold font-display text-stone-900">Artisan & Maker Story</h3>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.maker_story ||
              "Every KalaKart item is handcrafted by generational master craftspeople using traditional methods passed through generations. No industrial mold or assembly line is used."}
          </p>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-stone-700 leading-relaxed">
            <strong>Artisan Note:</strong> Slight variations in hue, glaze texture, or carving grain are natural hallmarks of authentic handcrafting, making your piece completely unique.
          </div>
        </div>

        {/* Material & Dimensions Specifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-display text-stone-900">Craft Details & Care</h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {product.materials && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Materials</span>
                <span className="text-stone-900 font-semibold">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Dimensions</span>
                <span className="text-stone-900 font-semibold">{product.dimensions}</span>
              </div>
            )}
            {product.care_instructions && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Care Tips</span>
                <span className="text-stone-900 font-semibold text-right max-w-xs">{product.care_instructions}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-stone-500 font-medium">Origin</span>
              <span className="text-stone-900 font-semibold">Handcrafted in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kala AI Product Q&A Panel */}
      <ProductQAPanel productSlug={product.slug} />

      {/* Reviews & AI Customer Sentiment */}
      <section className="my-12">
        <h3 className="text-2xl font-bold font-display text-stone-900 mb-6">
          Verified Customer Feedback
        </h3>

        {/* AI Sentiment Summary Card */}
        <ReviewSummaryCard summary={product.ai_review_summary || null} />

        {/* Reviews List */}
        <ReviewList reviews={reviews} />

        {/* Submit Review Form */}
        <ReviewForm
          productSlug={product.slug}
          onReviewSubmitted={() => {
            queryClient.invalidateQueries({ queryKey: ["reviews", slug] });
            queryClient.invalidateQueries({ queryKey: ["product", slug] });
          }}
        />
      </section>

      {/* Related Crafts Rail */}
      {product.related && product.related.length > 0 && (
        <ProductRail
          title="Similar Authentic Crafts"
          subtitle="Explore more handcrafted pieces from this tradition"
          products={product.related}
        />
      )}
    </div>
  );
};
