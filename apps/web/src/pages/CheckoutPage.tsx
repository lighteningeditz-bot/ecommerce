import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { formatINR } from "../lib/format";
import { Button } from "../components/ui/Button";
import { CheckCircle2, ShieldCheck, Truck, ArrowLeft, PackageCheck } from "lucide-react";

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState("Aarav Sharma");
  const [phone, setPhone] = useState("9876543210");
  const [line1, setLine1] = useState("Flat 402, Lotus Greens, Sector 45");
  const [line2, setLine2] = useState("Near City Park");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560034");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [isPlacing, setIsPlacing] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal_inr || 0;
  const shipping = cart?.shipping_inr || 0;
  const total = cart?.total_inr || 0;

  if (confirmedOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-stone-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-stone-600 text-sm mb-4">
          Thank you for supporting traditional Indian artisans. Your package is being packed with love and eco-friendly care.
        </p>

        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 max-w-md mx-auto mb-8 text-left space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Order Reference</span>
            <span className="font-bold text-stone-900">{confirmedOrderNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Payment Mode</span>
            <span className="font-bold text-stone-900 uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Deliver To</span>
            <span className="font-bold text-stone-900">{fullName}, {city}</span>
          </div>
          <div className="flex justify-between py-1 text-sm font-bold pt-2">
            <span>Total Payable</span>
            <span className="text-terracotta-700">{formatINR(total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-md">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <PackageCheck className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold font-display text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-xs text-stone-500 mb-6">Add items before proceeding to checkout.</p>
        <Link to="/shop">
          <Button variant="primary">Browse Handmade Crafts</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      toastError("Incomplete Address", "Please fill in all required shipping address fields.");
      return;
    }

    setIsPlacing(true);
    try {
      // Simulate order placement
      const orderNum = `KK-${Math.floor(100000 + Math.random() * 900000)}`;
      await new Promise((resolve) => setTimeout(resolve, 800));
      await clearCart();
      setConfirmedOrderNumber(orderNum);
      success("Order Confirmed!", `Order #${orderNum} has been placed.`);
    } catch {
      toastError("Order Failed", "Could not complete order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 mb-8">
        Checkout & Delivery
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Address & Payment Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Truck className="w-5 h-5 text-terracotta-600" />
              <h2 className="text-base font-bold font-display text-stone-900">
                1. Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 1 (House/Flat, Street) *</label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Line 2 (Landmark, Colony)</label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">PIN Code (6 digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold font-display text-stone-900">
                2. Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-terracotta-600 bg-terracotta-50/40 ring-1 ring-terracotta-500"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-terracotta-600"
                />
                <div>
                  <span className="font-bold text-stone-900 text-sm block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-xs text-stone-500">
                    Pay securely in cash or UPI upon package doorstep receipt. Zero extra surcharge.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "upi"
                    ? "border-terracotta-600 bg-terracotta-50/40 ring-1 ring-terracotta-500"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="mt-1 accent-terracotta-600"
                />
                <div>
                  <span className="font-bold text-stone-900 text-sm block">
                    UPI / QR Instant Pay (Test Mode)
                  </span>
                  <span className="text-xs text-stone-500">
                    Instant confirmation via Google Pay, PhonePe, or Paytm.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Review Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4 sticky top-28">
            <h2 className="text-base font-bold font-display text-stone-900 pb-3 border-b border-stone-100">
              Items in Order ({items.length})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        item.product.images?.[0]?.url ||
                        `https://picsum.photos/seed/${item.product.slug}/100/100`
                      }
                      alt={item.product.title}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 truncate">{item.product.title}</p>
                      <p className="text-stone-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 flex-shrink-0">
                    {formatINR(Number(item.product.price_inr) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900">{formatINR(shipping)}</span>
                )}
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-terracotta-700 text-lg">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md text-sm mt-4"
              isLoading={isPlacing}
            >
              Place Order ({formatINR(total)})
            </Button>

            <p className="text-[11px] text-stone-400 text-center">
              By placing your order, you agree to KalaKart's Terms and Fair Trade Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
