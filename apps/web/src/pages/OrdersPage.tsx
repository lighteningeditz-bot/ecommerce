import React from "react";
import { Link } from "react-router-dom";
import { formatINR, formatDate } from "../lib/format";
import { Truck, CheckCircle2, ArrowRight } from "lucide-react";

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "delivered" | "shipped" | "confirmed";
  total: number;
  items: Array<{
    title: string;
    qty: number;
    price: number;
    image: string;
  }>;
}

export const OrdersPage: React.FC = () => {
  const sampleOrders: MockOrder[] = [
    {
      id: "ord-1",
      orderNumber: "KK-892341",
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "delivered",
      total: 597,
      items: [
        {
          title: "Handwoven Bamboo Tea Light Lantern",
          qty: 1,
          price: 249,
          image: "https://picsum.photos/seed/bamboo-tea-light-lantern/200/200",
        },
        {
          title: "Hand-Painted Clay Kulhad Chai Cups (Set of 2)",
          qty: 1,
          price: 99,
          image: "https://picsum.photos/seed/hand-painted-terracotta-kulhad-set/200/200",
        },
        {
          title: "Cotton Rag Deckle-Edge Handbound Journal",
          qty: 1,
          price: 249,
          image: "https://picsum.photos/seed/handmade-cotton-rag-deckle-journal/200/200",
        },
      ],
    },
    {
      id: "ord-2",
      orderNumber: "KK-774912",
      date: new Date(Date.now() - 86400000 * 12).toISOString(),
      status: "delivered",
      total: 349,
      items: [
        {
          title: "Round Sabai Grass Storage Basket with Lid",
          qty: 1,
          price: 349,
          image: "https://picsum.photos/seed/round-sabai-grass-storage-basket/200/200",
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="pb-4 border-b border-stone-200 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
          Your Past Craft Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Review orders, delivery tracking, and receipts.
        </p>
      </div>

      <div className="space-y-6">
        {sampleOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-4"
          >
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 text-sm">{order.orderNumber}</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">{formatDate(order.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Delivered with Care
                </span>
                <span className="font-bold text-stone-900 text-sm ml-2">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Qty: {item.qty} • {formatINR(item.price)} each
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 flex-shrink-0">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Action footer */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-stone-400" />
                <span>Delivered via Eco Express Carrier</span>
              </span>
              <Link to="/shop" className="text-terracotta-700 font-semibold hover:underline flex items-center gap-1">
                <span>Buy Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
