import { Router, Response, NextFunction } from "express";
import { cartItemSchema, cartMergeSchema } from "@kalakart/shared";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { supabaseAdmin } from "../lib/supabase";
import { env } from "../config/env";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// Helper to compute cart totals
async function getCartResponse(userId: string, client: any) {
  const { data: items, error } = await client
    .from("cart_items")
    .select("*, product:products(*, images:product_images(*))")
    .eq("user_id", userId);

  if (error) throw error;

  let subtotal_inr = 0;
  for (const item of items || []) {
    if (item.product) {
      subtotal_inr += Number(item.product.price_inr) * item.quantity;
    }
  }

  // Get shipping threshold from store_settings or env
  const freeThreshold = env.FREE_SHIPPING_THRESHOLD_INR;
  const flatShipping = env.FLAT_SHIPPING_INR;
  const shipping_inr = subtotal_inr >= freeThreshold || subtotal_inr === 0 ? 0 : flatShipping;
  const total_inr = subtotal_inr + shipping_inr;
  const amount_needed_for_free_shipping = Math.max(0, freeThreshold - subtotal_inr);

  return {
    items: items || [],
    subtotal_inr,
    shipping_inr,
    total_inr,
    free_shipping_threshold: freeThreshold,
    amount_needed_for_free_shipping,
  };
}

// GET /api/cart
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await getCartResponse(req.user!.id, req.supabase);
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/items/:productId
router.put(
  "/items/:productId",
  validate({ body: cartItemSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user!.id;

      // Verify product exists and check stock
      const { data: product, error: pErr } = await supabaseAdmin
        .from("products")
        .select("id, stock_qty, is_published, title")
        .eq("id", productId)
        .single();

      if (pErr || !product || !product.is_published) {
        throw new ApiError(404, "PRODUCT_UNAVAILABLE", "Product is not available");
      }

      if (product.stock_qty <= 0) {
        throw new ApiError(400, "OUT_OF_STOCK", "Product is out of stock");
      }

      // Clamp quantity to available stock and max limit (20)
      const finalQty = Math.min(quantity, product.stock_qty, 20);

      // Upsert cart item
      const { error: upsertErr } = await req.supabase!
        .from("cart_items")
        .upsert(
          {
            user_id: userId,
            product_id: productId,
            quantity: finalQty,
          },
          { onConflict: "user_id,product_id" }
        );

      if (upsertErr) throw upsertErr;

      const data = await getCartResponse(userId, req.supabase);
      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/cart/items/:productId
router.delete(
  "/items/:productId",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userId = req.user!.id;

      const { error } = await req.supabase!
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;

      const data = await getCartResponse(userId, req.supabase);
      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/cart/merge - Merge guest cart on login
router.post(
  "/merge",
  validate({ body: cartMergeSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body;
      const userId = req.user!.id;

      for (const item of items) {
        // Check product
        const { data: prod } = await supabaseAdmin
          .from("products")
          .select("id, stock_qty, is_published")
          .eq("id", item.productId)
          .single();

        if (prod && prod.is_published && prod.stock_qty > 0) {
          // Check existing item in user's cart
          const { data: existing } = await req.supabase!
            .from("cart_items")
            .select("quantity")
            .eq("user_id", userId)
            .eq("product_id", item.productId)
            .single();

          const newQty = Math.min(
            (existing?.quantity || 0) + item.quantity,
            prod.stock_qty,
            20
          );

          await req.supabase!.from("cart_items").upsert(
            {
              user_id: userId,
              product_id: item.productId,
              quantity: newQty,
            },
            { onConflict: "user_id,product_id" }
          );
        }
      }

      const data = await getCartResponse(userId, req.supabase);
      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/cart - Clear cart
router.delete("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { error } = await req.supabase!.from("cart_items").delete().eq("user_id", userId);
    if (error) throw error;

    const data = await getCartResponse(userId, req.supabase);
    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
