import React from "react";
import { Truck, RefreshCcw, ShieldCheck, HelpCircle } from "lucide-react";

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-extrabold font-display text-stone-900">
          Shipping & Returns Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Honest, transparent terms for every handmade order.
        </p>
      </div>

      <div className="space-y-8 text-stone-700 text-sm leading-relaxed">
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg font-display">
            <Truck className="w-5 h-5 text-terracotta-600" />
            <h2>Free Shipping Threshold & Delivery Timelines</h2>
          </div>
          <p>
            Orders above <strong>₹499</strong> automatically qualify for <strong>100% Free Standard Shipping</strong> anywhere across India. For orders below ₹499, a flat subsidised fee of ₹40 is applied.
          </p>
          <p>
            Standard deliveries take <strong>3 to 6 business days</strong>. Since crafts are shipped directly from regional workshops, we use heavy-duty plastic-free corrugated packaging with shredded paper cushioning to protect delicate terracotta and pottery.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg font-display">
            <RefreshCcw className="w-5 h-5 text-emerald-600" />
            <h2>Cash on Delivery (COD)</h2>
          </div>
          <p>
            We proudly offer <strong>Cash on Delivery (COD)</strong> with <strong>zero surcharge</strong>. You can inspect the package exterior upon arrival and pay the delivery partner via cash or direct UPI QR scan.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg font-display">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2>7-Day Transit Breakage Replacement Guarantee</h2>
          </div>
          <p>
            Terracotta and glass items are packaged with utmost care. In the rare event that an item arrives chipped or damaged during transit, simply message us within <strong>7 days</strong> with a photo of the package, and we will dispatch a free replacement or issue a full refund immediately.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg font-display">
            <HelpCircle className="w-5 h-5 text-saffron-600" />
            <h2>Customer Support</h2>
          </div>
          <p>
            Have a question about an order? Reach our dedicated craft team at{" "}
            <a href="mailto:support@kalakart.in" className="text-terracotta-700 font-semibold underline">
              support@kalakart.in
            </a>
            . We typically respond within 2 to 4 hours.
          </p>
        </section>
      </div>
    </div>
  );
};
