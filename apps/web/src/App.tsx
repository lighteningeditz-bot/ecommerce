import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";
import { CartProvider } from "./hooks/useCart";
import { WishlistProvider } from "./hooks/useWishlist";
import { AppShell } from "./components/layout/AppShell";

// Pages
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { GiftAdvisorPage } from "./pages/GiftAdvisorPage";
import { WishlistPage } from "./pages/WishlistPage";
import { LoginPage } from "./pages/LoginPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AboutPage } from "./pages/AboutPage";
import { ShippingReturnsPage } from "./pages/ShippingReturnsPage";
import { AdminPage } from "./pages/AdminPage";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AppShell />}>
                    <Route index element={<HomePage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="category/:categorySlug" element={<ShopPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="gift-advisor" element={<GiftAdvisorPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="account" element={<OrdersPage />} />
                    <Route path="account/orders" element={<OrdersPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="shipping-returns" element={<ShippingReturnsPage />} />
                    <Route path="admin" element={<AdminPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
