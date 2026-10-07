import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@kalakart/shared";
import { api } from "../lib/api";
import { HeroBanner } from "../components/catalog/HeroBanner";
import { BudgetBandChips } from "../components/catalog/BudgetBandChips";
import { CategoryGrid } from "../components/catalog/CategoryGrid";
import { ProductRail } from "../components/catalog/ProductRail";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export const HomePage: React.FC = () => {
  const { data: catalogData, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ["products", "home"],
    queryFn: () => api.get<{ products: Product[] }>("/products?pageSize=20"),
  });

  const products = catalogData?.products || [];

  // Segment products for rails
  const under199 = products.filter((p) => p.price_inr <= 199);
  const featured = products.filter((p) => p.avg_rating >= 4.8);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Quick Budget Band Filters */}
      <BudgetBandChips />

      {/* Category Traditions Grid */}
      <CategoryGrid />

      {/* Budget Rail: Under ₹199 */}
      <ProductRail
        title="Artisanal Treasures Under ₹199"
        subtitle="Remarkable handmade crafts that fit every single pocket"
        viewAllHref="/shop?band=under-199"
        products={under199.length > 0 ? under199 : products.slice(0, 4)}
        isLoading={isLoading}
      />

      {/* Trust & Craft Manifesto Banner */}
      <section className="my-12 bg-gradient-to-br from-terracotta-50 via-cream-50 to-saffron-50 rounded-3xl p-6 sm:p-10 border border-terracotta-200/60 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-3 md:col-span-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-terracotta-600" />
              Direct Artisan Collective
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 tracking-tight">
              Why We Cap Every Single Craft at ₹2,500
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              True craft was never intended to be an overpriced luxury for a few. By partnering
              directly with rural pottery clusters, bamboo weavers, and wooden toy artisans across
              India, we eliminate distributors and marketing markups.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Machine Replicas</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-terracotta-600" />
                <span>100% Direct Fair Compensation</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-saffron-100 text-saffron-800 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 font-display">Need Help Choosing?</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Ask our Kala AI Advisor to recommend budget-conscious crafts tailored for your space or gifting.
            </p>
            <Link
              to="/gift-advisor"
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Launch AI Gift Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Masterpieces Rail */}
      <ProductRail
        title="Top Rated by Verified Buyers"
        subtitle="Artisan creations rated 4.8 stars or higher"
        viewAllHref="/shop"
        products={featured.length > 0 ? featured : products.slice(0, 6)}
        isLoading={isLoading}
      />

      {/* New Arrivals Rail */}
      <ProductRail
        title="Fresh from the Kiln & Loom"
        subtitle="Newly cataloged crafts from regional workshops"
        viewAllHref="/shop"
        products={newArrivals}
        isLoading={isLoading}
      />
    </div>
  );
};
