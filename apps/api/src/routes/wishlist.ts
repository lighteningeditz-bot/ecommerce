import { Router, Response, NextFunction } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// GET /api/wishlist
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await req.supabase!
      .from("wishlist_items")
      .select("*, product:products(*, images:product_images(*))")
      .eq("user_id", req.user!.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ data: data || [], error: null });
  } catch (err) {
    next(err);
  }
});

// PUT /api/wishlist/:productId
router.put(
  "/:productId",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;

      const { data, error } = await req.supabase!
        .from("wishlist_items")
        .upsert(
          {
            user_id: userId,
            product_id: productId,
          },
          { onConflict: "user_id,product_id" }
        )
        .select()
        .single();

      if (error) throw error;
      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/wishlist/:productId
router.delete(
  "/:productId",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;

      const { error } = await req.supabase!
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
      res.json({ data: { success: true }, error: null });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
