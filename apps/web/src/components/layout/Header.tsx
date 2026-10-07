import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Sparkles,
  Menu,
  X,
  LogOut,
  Shield,
  Package,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-terracotta-600 to-terracotta-800 flex items-center justify-center text-white font-display font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight leading-none">
                Kala<span className="text-terracotta-600">Kart</span>
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-wider uppercase">
                Handmade • Under ₹2,500
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handmade terracotta, bamboo, jute crafts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-200 bg-stone-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* AI Advisor CTA Button */}
            <Link
              to="/gift-advisor"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-saffron-50 to-terracotta-50 border border-saffron-200 text-stone-900 text-xs font-semibold hover:shadow-sm hover:border-terracotta-300 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta-600 animate-pulse" />
              <span>AI Gift Advisor</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-600 hover:text-terracotta-600 hover:bg-stone-50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-600 hover:text-terracotta-600 hover:bg-stone-50 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-scale-up">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                    aria-label="Account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 font-bold text-xs flex items-center justify-center">
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>

                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-scale-up">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {profile?.full_name || "Craft Lover"}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-terracotta-700 font-semibold hover:bg-terracotta-50"
                        >
                          <Shield className="w-4 h-4 text-terracotta-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <UserIcon className="w-4 h-4 text-stone-400" />
                        <span>Profile & Addresses</span>
                      </Link>

                      <Link
                        to="/account/orders"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>Order History</span>
                      </Link>

                      <button
                        onClick={() => {
                          signOut();
                          setIsAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left border-t border-stone-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 text-white text-xs sm:text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search affordable handmade crafts..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-stone-800 py-2 border-b border-stone-100"
          >
            Explore All Crafts
          </Link>
          <Link
            to="/gift-advisor"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-terracotta-700 py-2 border-b border-stone-100"
          >
            <Sparkles className="w-4 h-4 text-terracotta-600" />
            <span>AI Gift & Craft Advisor</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm text-stone-600 py-2 border-b border-stone-100"
          >
            About & Affordability Promise
          </Link>
          <Link
            to="/shipping-returns"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm text-stone-600 py-2"
          >
            Shipping & Returns Policy
          </Link>
        </div>
      )}
    </header>
  );
};
