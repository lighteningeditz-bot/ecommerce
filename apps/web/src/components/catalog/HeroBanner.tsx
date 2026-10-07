import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, IndianRupee } from "lucide-react";
import { Button } from "../ui/Button";

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-terracotta-900 via-terracotta-800 to-stone-900 text-white my-6 shadow-xl">
      {/* Decorative craft background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FED7AA_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12 sm:py-20 text-center flex flex-col items-center">
        {/* Affordability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-saffron-300 text-xs font-semibold mb-6">
          <IndianRupee className="w-3.5 h-3.5 text-saffron-400" />
          <span>Every Single Craft Under ₹2,500 • Guaranteed</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-cream-50 max-w-3xl leading-[1.15]">
          Authentic Handmade Crafts for <span className="text-saffron-400">Every Budget</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-cream-200/90 max-w-2xl leading-relaxed">
          Direct from traditional Indian potters, weavers, and wooden toy artisans. No middlemen, no
          inflated prices, and zero compromise on artisanal soul.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-bold text-stone-950 shadow-lg shadow-saffron-500/20"
            >
              <span>Explore All Crafts</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <Link to="/gift-advisor" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 hover:border-white"
            >
              <Sparkles className="w-4 h-4 mr-2 text-saffron-300" />
              <span>Ask AI Gift Advisor</span>
            </Button>
          </Link>
        </div>

        {/* Trust Points */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center max-w-xl w-full">
          <div>
            <p className="text-base sm:text-xl font-extrabold text-saffron-300 font-display">100%</p>
            <p className="text-[11px] sm:text-xs text-cream-200/80 mt-0.5">Handcrafted</p>
          </div>
          <div className="border-x border-white/10">
            <p className="text-base sm:text-xl font-extrabold text-saffron-300 font-display">₹49 – ₹2,500</p>
            <p className="text-[11px] sm:text-xs text-cream-200/80 mt-0.5">Fair Pricing</p>
          </div>
          <div>
            <p className="text-base sm:text-xl font-extrabold text-saffron-300 font-display">COD</p>
            <p className="text-[11px] sm:text-xs text-cream-200/80 mt-0.5">Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};
