import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

export const MobileNav: React.FC = () => {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Compass },
    { to: "/gift-advisor", label: "Advisor", icon: Sparkles, highlight: true },
    { to: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlist.length },
    { to: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-2 flex justify-around items-center shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-terracotta-600 font-bold"
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`
            }
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  item.highlight ? "text-terracotta-600 animate-pulse" : ""
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-terracotta-600 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
