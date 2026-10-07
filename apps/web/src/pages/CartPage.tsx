import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatINR } from "../lib/format";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { Trash2, Truck, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal_inr || 0;
  const shipping = cart?.shipping_inr || 0;
  const total = cart?.total_inr || 0;
  const freeThreshold = cart?.free_shipping_threshold || 499;
  const amountNeeded = cart?.amount_needed_for_free_shipping || 0;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  if (items.length === 0 && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-terracotta-50 text-terracotta-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold font-display text-stone-900 mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">
          Support Indian artisans today. Discover authentic handmade crafts guaranteed under ₹2,500.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="font-semibold shadow-md">
            <span>Explore All Crafts</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
          Shopping Cart ({items.length} {items.length === 1 ? "craft" : "crafts"})
        </h1>
        {items.length > 0 && (
          <button
            onClick={() => clearCart()}
            className="text-xs text-stone-500 hover:text-red-600 transition-colors font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-terracotta-600" />
                {amountNeeded > 0 ? (
                  <span>
                    Add <strong className="text-terracotta-700">{formatINR(amountNeeded)}</strong> more to get{" "}
                    <strong className="text-emerald-700">FREE Delivery</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">
                    Congratulations! You unlocked FREE Delivery!
                  </span>
                )}
              </div>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-saffron-500 to-terracotta-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          {items.map((item) => {
            const product = item.product;
            const primaryImage =
              product?.images && product.images.length > 0
                ? product.images[0]?.url
                : `https://picsum.photos/seed/${product?.slug || "craft"}/800/800`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-sm flex gap-4 sm:gap-6 items-center"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${product?.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200/60"
                >
                  <img
                    src={primaryImage}
                    alt={product?.title || "Craft item"}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    {product?.category?.name || "Handmade"}
                  </span>
                  <Link
                    to={`/product/${product?.slug}`}
                    className="block text-sm sm:text-base font-bold text-stone-900 hover:text-terracotta-600 transition-colors truncate mt-0.5"
                  >
                    {product?.title}
                  </Link>

                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-stone-900">
                        {formatINR(Number(product?.price_inr || 0))}
                      </span>
                      {product?.compare_at_price_inr && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatINR(Number(product.compare_at_price_inr))}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={Math.min(product?.stock_qty || 20, 20)}
                        onChange={(newQty) => updateQuantity(item.product_id, newQty)}
                      />

                      <button
                        type="button"
                        onClick={() => removeItem(item.product_id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4 sticky top-28">
            <h2 className="text-lg font-bold font-display text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900">{formatINR(shipping)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-terracotta-700 text-lg">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md text-sm mt-4"
              onClick={() => navigate("/checkout")}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cash on Delivery (COD) supported</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Fair pricing • Direct from Indian artisan clusters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
