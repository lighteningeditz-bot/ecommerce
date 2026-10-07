import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, ShieldCheck, Sparkles, RefreshCcw } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-terracotta-900/40 text-terracotta-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Under ₹2,500 Cap</h4>
              <p className="text-xs text-stone-400 mt-1">
                Guaranteed affordable handmade pricing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-saffron-900/40 text-saffron-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Artisan Fair Pay</h4>
              <p className="text-xs text-stone-400 mt-1">
                Support rural craft clusters directly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-900/40 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">AI Gift & Craft Advisor</h4>
              <p className="text-xs text-stone-400 mt-1">
                Budget-conscious honest suggestions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-900/40 text-emerald-400">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">
                Safe payment upon package receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <span className="font-display font-bold text-2xl text-white">
              Kala<span className="text-terracotta-500">Kart</span>
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              India's first affordability-driven marketplace for authentic handmade crafts, pottery,
              macramé, and eco-friendly home living.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-terracotta-400 transition-colors">
                  All Handmade Crafts
                </Link>
              </li>
              <li>
                <Link to="/shop?band=under-99" className="hover:text-terracotta-400 transition-colors">
                  Under ₹99 Store
                </Link>
              </li>
              <li>
                <Link to="/shop?band=under-199" className="hover:text-terracotta-400 transition-colors">
                  Best Under ₹199
                </Link>
              </li>
              <li>
                <Link to="/gift-advisor" className="hover:text-terracotta-400 transition-colors">
                  AI Gift & Craft Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shipping-returns" className="hover:text-terracotta-400 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-terracotta-400 transition-colors">
                  Affordability Promise
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-terracotta-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Craft Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Crafts
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/pottery-terracotta" className="hover:text-terracotta-400 transition-colors">
                  Pottery & Terracotta
                </Link>
              </li>
              <li>
                <Link to="/category/woven-basketry" className="hover:text-terracotta-400 transition-colors">
                  Sabai Grass & Woven Jute
                </Link>
              </li>
              <li>
                <Link to="/category/wall-art-macrame" className="hover:text-terracotta-400 transition-colors">
                  Macramé & Folk Wall Art
                </Link>
              </li>
              <li>
                <Link to="/category/kids-toys" className="hover:text-terracotta-400 transition-colors">
                  Channapatna Wooden Toys
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} KalaKart India. Handmade with care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
