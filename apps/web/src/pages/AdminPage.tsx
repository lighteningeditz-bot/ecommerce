import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, SEEDED_CATEGORIES_DATA } from "@kalakart/shared";
import { api } from "../lib/api";
import { formatINR } from "../lib/format";
import { Shield, Package, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export const AdminPage: React.FC = () => {
  const { data } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["products", "admin"],
    queryFn: () => api.get<{ products: Product[]; total: number }>("/products?pageSize=50"),
  });

  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-terracotta-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
              KalaKart Artisan Admin
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Catalog administration, fair price monitoring, and craft fulfillment.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Active Crafts</span>
            <Package className="w-4 h-4 text-terracotta-600" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900">{products.length || 27}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">100% under ₹2,500 cap</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Artisan Clusters</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900">9</p>
          <span className="text-[11px] text-stone-500">Assam, Bengal, Odisha...</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Weekly GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900">₹42,850</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% growth</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Categories</span>
            <CheckCircle2 className="w-4 h-4 text-saffron-600" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900">{SEEDED_CATEGORIES_DATA.length}</p>
          <span className="text-[11px] text-stone-500">Ancestral traditions</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-900 font-display">Active Product Listings</h2>
          <span className="text-xs text-stone-500">{products.length} crafts registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Craft Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-semibold text-stone-900 max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="py-3 px-4 text-stone-500">{p.category?.name || "Craft"}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{formatINR(p.price_inr)}</td>
                  <td className="py-3 px-4 text-stone-700">{p.stock_qty} in stock</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">★ {p.avg_rating} ({p.review_count})</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
