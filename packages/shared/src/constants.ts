export const PRICE_BANDS = [
  { key: "under-99", label: "Under ₹99", min: 0, max: 99 },
  { key: "under-199", label: "Under ₹199", min: 0, max: 199 },
  { key: "under-499", label: "Under ₹499", min: 0, max: 499 },
  { key: "under-999", label: "Under ₹999", min: 0, max: 999 },
  { key: "under-2500", label: "Under ₹2,500", min: 0, max: 2500 },
] as const;

export type PriceBandKey = (typeof PRICE_BANDS)[number]["key"];

export const MAX_LISTING_PRICE_INR = 2500;
export const FREE_SHIPPING_THRESHOLD_INR = 499;
export const FLAT_SHIPPING_INR = 40;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["cod"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const USER_ROLES = ["customer", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const SEEDED_CATEGORIES = [
  { slug: "home-decor", name: "Home Décor", minPrice: 99, maxPrice: 1499 },
  { slug: "pottery-terracotta", name: "Pottery & Terracotta", minPrice: 49, maxPrice: 999 },
  { slug: "woven-basketry", name: "Woven & Basketry", minPrice: 149, maxPrice: 1299 },
  { slug: "jewellery-accessories", name: "Handmade Jewellery & Accessories", minPrice: 49, maxPrice: 799 },
  { slug: "paper-stationery", name: "Paper Crafts & Stationery", minPrice: 29, maxPrice: 499 },
  { slug: "wall-art-macrame", name: "Wall Art & Macramé", minPrice: 149, maxPrice: 1999 },
  { slug: "festive-gifting", name: "Festive & Gifting", minPrice: 49, maxPrice: 999 },
  { slug: "kids-toys", name: "Wooden & Kids' Crafts", minPrice: 79, maxPrice: 899 },
  { slug: "diy-kits", name: "DIY Craft Kits", minPrice: 99, maxPrice: 799 },
] as const;
