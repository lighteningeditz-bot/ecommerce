import { Router, Response, NextFunction } from "express";
import { productUpsertSchema, productUpsertBaseSchema, MAX_LISTING_PRICE_INR } from "@kalakart/shared";
import { AuthenticatedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { supabaseAdmin } from "../../lib/supabase";
import { ApiError } from "../../middleware/errorHandler";

const router = Router();

// GET /api/admin/products - List all (including drafts)
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 20)));
    const q = req.query.q as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;

    let query = supabaseAdmin
      .from("products")
      .select("*, category:categories(*), images:product_images(*)", { count: "exact" });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (q) {
      query = query.ilike("title", `%${q.trim()}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: products, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      data: {
        products: products || [],
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

// POST /api/admin/products - Create product
router.post(
  "/",
  validate({ body: productUpsertSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const prodData = req.body;

      // Affordability Check
      if (prodData.price_inr > MAX_LISTING_PRICE_INR) {
        throw new ApiError(
          400,
          "AFFORDABILITY_CAP_EXCEEDED",
          `Price cannot exceed store affordability cap of ₹${MAX_LISTING_PRICE_INR}`
        );
      }

      // Generate slug if omitted
      let slug = prodData.slug;
      if (!slug) {
        const base = prodData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
          .slice(0, 80);
        slug = `${base}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const { data, error } = await supabaseAdmin
        .from("products")
        .insert({
          ...prodData,
          slug,
        })
        .select("*, category:categories(*)")
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new ApiError(409, "SLUG_CONFLICT", "A product with this slug already exists.");
        }
        throw error;
      }

      res.status(201).json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/admin/products/:id - Read product
router.get("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
    }

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/products/:id - Update product
router.patch(
  "/:id",
  validate({ body: productUpsertBaseSchema.partial() }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.price_inr && updates.price_inr > MAX_LISTING_PRICE_INR) {
        throw new ApiError(
          400,
          "AFFORDABILITY_CAP_EXCEEDED",
          `Price cannot exceed store affordability cap of ₹${MAX_LISTING_PRICE_INR}`
        );
      }

      const { data, error } = await supabaseAdmin
        .from("products")
        .update(updates)
        .eq("id", id)
        .select("*, category:categories(*), images:product_images(*)")
        .single();

      if (error || !data) {
        throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found or update failed");
      }

      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/products/:id - Delete or soft delete
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if product exists in any order
    const { count } = await supabaseAdmin
      .from("order_items")
      .select("*", { count: "exact", head: true })
      .eq("product_id", id);

    if (count && count > 0) {
      // Soft delete: unpublish to preserve order history integrity
      await supabaseAdmin.from("products").update({ is_published: false }).eq("id", id);
      res.json({
        data: { success: true, message: "Product archived/unpublished because it is referenced in past orders." },
        error: null,
      });
      return;
    }

    // Hard delete if not ordered
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;

    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
