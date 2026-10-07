import { Router, Request, Response, NextFunction } from "express";
import { productListQuerySchema, PRICE_BANDS } from "@kalakart/shared";
import { validate } from "../middleware/validate";
import { supabasePublic, supabaseAdmin } from "../lib/supabase";
import { getOrGenerateReviewSummary } from "../ai/reviewSummary";
import { env } from "../config/env";
import { ApiError } from "../middleware/errorHandler";

const router = Router();

// GET /api/settings - Store configuration
router.get("/settings", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabasePublic
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      // Fallback to environment defaults if database table not yet populated
      res.json({
        data: {
          id: 1,
          max_listing_price_inr: env.MAX_LISTING_PRICE_INR,
          free_shipping_threshold: env.FREE_SHIPPING_THRESHOLD_INR,
          flat_shipping_inr: env.FLAT_SHIPPING_INR,
        },
        error: null,
      });
      return;
    }

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories - Active categories
router.get("/categories", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabasePublic
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    res.json({ data: data || [], error: null });
  } catch (err) {
    next(err);
  }
});

// GET /api/products - Catalog list with search, filter, sort, pagination
router.get(
  "/products",
  validate({ query: productListQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = req.query.q as string | undefined;
      const categorySlug = req.query.category as string | undefined;
      const band = req.query.band as string | undefined;
      let minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
      let maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
      const sort = (req.query.sort as string) || "newest";
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 12;

      // Handle budget bands
      if (band) {
        const foundBand = PRICE_BANDS.find((b) => b.key === band);
        if (foundBand) {
          minPrice = minPrice !== undefined ? Math.max(minPrice, foundBand.min) : foundBand.min;
          maxPrice = maxPrice !== undefined ? Math.min(maxPrice, foundBand.max) : foundBand.max;
        }
      }

      let categoryId: string | undefined;
      if (categorySlug) {
        const { data: cat } = await supabasePublic
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) categoryId = cat.id;
      }

      let query = supabasePublic
        .from("products")
        .select("*, category:categories(*), images:product_images(*)", { count: "exact" })
        .eq("is_published", true);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (minPrice !== undefined) {
        query = query.gte("price_inr", minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte("price_inr", maxPrice);
      }

      if (q && q.trim().length > 0) {
        const cleanQuery = q.trim();
        // Use text search query or fallback to ilike on title
        query = query.or(
          `title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,materials.ilike.%${cleanQuery}%`
        );
      }

      // Sort
      switch (sort) {
        case "price_asc":
          query = query.order("price_inr", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price_inr", { ascending: false });
          break;
        case "rating":
          query = query.order("avg_rating", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      res.json({
        data: {
          products: data || [],
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/products/:slug - Product detail + images + related
router.get("/products/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const { data: product, error } = await supabasePublic
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !product) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found or unavailable");
    }

    // Fetch up to 4 related products in same category
    const { data: related } = await supabasePublic
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("category_id", product.category_id)
      .eq("is_published", true)
      .neq("id", product.id)
      .limit(4);

    res.json({
      data: {
        ...product,
        related: related || [],
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug/reviews - Paginated reviews
router.get("/products/:slug/reviews", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(20, Math.max(1, Number(req.query.pageSize || 5)));

    const { data: prod } = await supabasePublic
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!prod) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: reviews, count, error } = await supabasePublic
      .from("reviews")
      .select("id, rating, title, body, created_at, profile:profiles(full_name)", { count: "exact" })
      .eq("product_id", prod.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      data: {
        reviews: reviews || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug/review-summary - Cached or newly generated AI review summary
router.get("/products/:slug/review-summary", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const result = await getOrGenerateReviewSummary(slug);
    res.json({ data: result.summary, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
