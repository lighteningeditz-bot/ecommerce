import React from "react";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-charcoal-900 text-cream-100 text-xs py-2 px-4 border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-4 text-center">
        <div className="flex items-center gap-1.5 font-medium">
          <Truck className="w-3.5 h-3.5 text-saffron-400" />
          <span>Free shipping on all orders above ₹499</span>
        </div>
        <span className="hidden sm:inline text-charcoal-700">•</span>
        <div className="hidden sm:flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cash on Delivery (COD) supported</span>
        </div>
        <span className="hidden md:inline text-charcoal-700">•</span>
        <div className="hidden md:flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
          <span>Affordable handmade crafts under ₹2,500</span>
        </div>
      </div>
    </div>
  );
};
