import { Router, Response, NextFunction } from "express";
import { categoryUpsertSchema } from "@kalakart/shared";
import { AuthenticatedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { supabaseAdmin } from "../../lib/supabase";
import { ApiError } from "../../middleware/errorHandler";

const router = Router();

// GET /api/admin/categories - List all categories
router.get("/", async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    res.json({ data: data || [], error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/categories - Create category
router.post(
  "/",
  validate({ body: categoryUpsertSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("categories")
        .insert(req.body)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new ApiError(409, "SLUG_CONFLICT", "A category with this slug already exists.");
        }
        throw error;
      }

      res.status(201).json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/admin/categories/:id - Update category
router.patch(
  "/:id",
  validate({ body: categoryUpsertSchema.partial() }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from("categories")
        .update(req.body)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        throw new ApiError(404, "CATEGORY_NOT_FOUND", "Category not found or update failed");
      }

      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/categories/:id - Delete category (reject if products exist)
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if any products exist in this category
    const { count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0) {
      throw new ApiError(
        400,
        "CATEGORY_IN_USE",
        `Cannot delete category with ${count} existing products. Reassign or delete products first.`
      );
    }

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw error;

    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
