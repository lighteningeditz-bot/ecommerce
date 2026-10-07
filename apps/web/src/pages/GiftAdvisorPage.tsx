import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { GiftAdvisorHydratedResult } from "@kalakart/shared";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { formatINR } from "../lib/format";
import { Button } from "../components/ui/Button";
import { Sparkles, Gift, ArrowRight, PackagePlus, Info } from "lucide-react";

export const GiftAdvisorPage: React.FC = () => {
  const { addItem } = useCart();
  const { success } = useToast();

  const [recipient, setRecipient] = useState("Friend / Bestie");
  const [budgetMax, setBudgetMax] = useState(500);
  const [occasion, setOccasion] = useState("Housewarming / New Home");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GiftAdvisorHydratedResult | null>(null);

  const recipientOptions = [
    "Friend / Bestie",
    "Parents / Family",
    "Housewarming Host",
    "Office Colleague",
    "Festival / Diwali Guest",
    "Myself (Self-love)",
  ];

  const budgetOptions = [
    { label: "Under ₹199 (Pocket Friendly)", value: 199 },
    { label: "Under ₹499 (Most Popular)", value: 499 },
    { label: "Under ₹999 (Thoughtful Set)", value: 999 },
    { label: "Under ₹2,500 (Grand Heritage)", value: 2500 },
  ];

  const occasionOptions = [
    "Housewarming / New Home",
    "Festive Celebration",
    "Birthday / Milestone",
    "Return Gifting (Bulk)",
    "Everyday Living Accent",
  ];

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.post<GiftAdvisorHydratedResult>("/ai/gift-advisor", {
        recipient,
        budget_max: budgetMax,
        occasion,
        notes: notes.trim() || undefined,
      });

      setResult(data);
    } catch {
      // Fallback is handled inside api.ts automatically
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-terracotta-600 animate-pulse" />
          <span>Kala AI Gift & Craft Advisor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
          Find the Perfect Handcrafted Gift Within Your Budget
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          Tell Kala AI about the occasion and your spending limit. We’ll find authentic artisanal
          creations that feel personal, meaningful, and strictly under ₹2,500.
        </p>
      </div>

      {/* Interactive Advisor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md mb-12">
        <form onSubmit={handleConsult} className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Who are you gifting?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recipientOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRecipient(opt)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    recipient === opt
                      ? "bg-terracotta-50 border-terracotta-500 text-terracotta-800 ring-1 ring-terracotta-500"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Limit Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Maximum Budget Limit
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {budgetOptions.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBudgetMax(b.value)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                    budgetMax === b.value
                      ? "bg-terracotta-50 border-terracotta-500 text-terracotta-800 ring-1 ring-terracotta-500"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Occasion or Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {occasionOptions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    occasion === occ
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Special request / vibe notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves indoor gardening, likes minimalist earthy terracotta or tea lovers"
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-lg shadow-terracotta-600/20 text-sm"
            isLoading={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Generate Artisanal Gifting Ideas</span>
          </Button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <section className="space-y-8 animate-fade-in">
          {/* Budget Tip Callout */}
          {result.budget_tip && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Artisan Pricing Insight:</strong> {result.budget_tip}
              </div>
            </div>
          )}

          {/* Individual Recommendations */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-terracotta-600" />
              <span>Personalized Recommendations</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {result.recommendations.map((rec) => {
                const prod = rec.product;
                const img = prod.images?.[0]?.url || `https://picsum.photos/seed/${prod.slug}/800/800`;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={img}
                          alt={prod.title}
                          className="w-full h-full object-cover object-center"
                        />
                        <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Match #{rec.rank}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-terracotta-700 uppercase">
                        {prod.category?.name || "Handcrafted"}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900 line-clamp-2 mt-0.5">
                        {prod.title}
                      </h3>

                      <p className="text-xs text-stone-500 mt-2 line-clamp-3 italic">
                        "{rec.reason}"
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="font-bold text-stone-900 text-base">
                        {formatINR(prod.price_inr)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/product/${prod.slug}`}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs"
                          aria-label="View craft details"
                        >
                          Details
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            addItem(prod, 1);
                            success(`Added ${prod.title} to cart`);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curated Bundle Recommendation */}
          {result.bundle && (
            <div className="bg-gradient-to-br from-terracotta-900 via-stone-900 to-charcoal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-2 text-saffron-300 text-xs font-bold uppercase tracking-wider">
                <PackagePlus className="w-4 h-4" />
                <span>Pairing Suggestion • Complete Gift Bundle</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-cream-50">
                {result.bundle.title}
              </h3>
              <p className="text-xs sm:text-sm text-cream-200/90 mt-1 mb-4 max-w-xl">
                {result.bundle.rationale}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-xs text-stone-400 block">Bundle Total</span>
                  <span className="text-2xl font-bold font-display text-saffron-400">
                    {formatINR(result.bundle.total_price_inr)}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  className="font-bold text-stone-900"
                  onClick={() => {
                    result.bundle?.products.forEach((p) => addItem(p, 1));
                    success("Gift Bundle added to cart!");
                  }}
                >
                  <span>Add Entire Bundle to Cart</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
