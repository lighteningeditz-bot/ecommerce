import { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from "./constants";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

export interface StoreSettings {
  id: number;
  max_listing_price_inr: number;
  free_shipping_threshold: number;
  flat_shipping_inr: number;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  short_description?: string | null;
  description: string;
  highlights: string[];
  tags: string[];
  materials?: string | null;
  dimensions?: string | null;
  care_instructions?: string | null;
  maker_story?: string | null;
  price_inr: number;
  compare_at_price_inr?: number | null;
  stock_qty: number;
  sku?: string | null;
  is_published: boolean;
  avg_rating: number;
  review_count: number;
  ai_review_summary?: {
    overview: string;
    pros: string[];
    cons: string[];
    sentiment: "positive" | "mixed" | "negative";
  } | null;
  ai_review_summary_count: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductDetail extends Product {
  category: Category;
  images: ProductImage[];
  related: Product[];
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  subtotal_inr: number;
  shipping_inr: number;
  total_inr: number;
  free_shipping_threshold: number;
  amount_needed_for_free_shipping: number;
}

export interface WishlistItem {
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  title_snapshot: string;
  image_snapshot?: string | null;
  unit_price_inr: number;
  quantity: number;
  line_total_inr: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal_inr: number;
  shipping_inr: number;
  total_inr: number;
  ship_full_name: string;
  ship_phone: string;
  ship_line1: string;
  ship_line2?: string | null;
  ship_city: string;
  ship_state: string;
  ship_pincode: string;
  customer_note?: string | null;
  placed_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
  };
}

export interface AdminStats {
  orders_today: number;
  revenue_7_days: number;
  low_stock_count: number;
  pending_orders_count: number;
}

export interface GiftAdvisorHydratedResult {
  recommendations: Array<{
    product: Product;
    rank: number;
    reason: string;
    fit_tags?: string[];
  }>;
  bundle: {
    title: string;
    products: Product[];
    total_price_inr: number;
    rationale: string;
  } | null;
  budget_tip: string;
  note?: string;
  source: "ai" | "fallback";
}
