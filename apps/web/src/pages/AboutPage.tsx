import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { HeartHandshake, ShieldCheck, Sparkles, Award } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-terracotta-600" />
          The KalaKart Manifesto
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Handmade Should Not Be a Luxury.
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          We founded KalaKart with a single conviction: authentic artisanal crafts belong in everyday
          homes, not behind prohibitive boutique price tags.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 font-display text-lg">Strict ₹2,500 Cap</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every craft on our platform is capped under ₹2,500. No artificial inflation, luxury markups,
            or multi-tier agent commissions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-800 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 font-display text-lg">Direct Artisan Fair Pay</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We work directly with craft clusters in Assam, Bengal, Odisha, Karnataka, and Rajasthan.
            Artisans receive dignity, timely fair payment, and steady livelihood.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900 font-display text-lg">Kala AI Grounded Tech</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our AI advisor analyzes real material specs and budgets to assist you with honest,
            helpful gifting and styling recommendations.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link to="/shop">
          <Button variant="primary" size="lg" className="font-bold shadow-md">
            Explore All Authentic Crafts
          </Button>
        </Link>
      </div>
    </div>
  );
};
