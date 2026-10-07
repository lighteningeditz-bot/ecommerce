import { Router, Response, NextFunction } from "express";
import { reviewCreateSchema } from "@kalakart/shared";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { supabasePublic } from "../lib/supabase";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// POST /api/products/:slug/reviews
router.post(
  "/:slug/reviews",
  validate({ body: reviewCreateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const { rating, title, body } = req.body;
      const userId = req.user!.id;

      // Find product id
      const { data: prod, error: pErr } = await supabasePublic
        .from("products")
        .select("id")
        .eq("slug", slug)
        .single();

      if (pErr || !prod) {
        throw new ApiError(404, "PRODUCT_NOT_FOUND", "Product not found");
      }

      // Insert review (Postgres trigger 'enforce_verified_review' verifies delivered order)
      const { data, error } = await req.supabase!
        .from("reviews")
        .insert({
          product_id: prod.id,
          user_id: userId,
          rating,
          title: title || null,
          body: body || null,
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes("delivered order")) {
          throw new ApiError(
            403,
            "UNVERIFIED_PURCHASE",
            "Only customers who have received this delivered product can leave a review."
          );
        }
        if (error.code === "23505") {
          throw new ApiError(
            409,
            "DUPLICATE_REVIEW",
            "You have already submitted a review for this product."
          );
        }
        throw error;
      }

      res.status(201).json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/reviews/:id - Delete own review
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { error } = await req.supabase!
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
