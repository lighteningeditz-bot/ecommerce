import { Router, Response, NextFunction } from "express";
import { placeOrderSchema } from "@kalakart/shared";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { supabaseAdmin } from "../lib/supabase";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// POST /api/orders - Place order via atomic place_order RPC
router.post(
  "/",
  validate({ body: placeOrderSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { addressId, note } = req.body;
      const userId = req.user!.id;

      // Call database atomic function using service role
      const { data: orderId, error: rpcError } = await supabaseAdmin.rpc("place_order", {
        p_user_id: userId,
        p_address_id: addressId,
        p_note: note || null,
      });

      if (rpcError) {
        throw new ApiError(400, "ORDER_PLACEMENT_FAILED", rpcError.message);
      }

      // Fetch the created order with its items
      const { data: order, error: fetchErr } = await supabaseAdmin
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", orderId)
        .single();

      if (fetchErr || !order) {
        res.status(201).json({ data: { id: orderId }, error: null });
        return;
      }

      res.status(201).json({ data: order, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/orders - User's own orders
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(20, Math.max(1, Number(req.query.pageSize || 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: orders, count, error } = await req.supabase!
      .from("orders")
      .select("*, items:order_items(*)", { count: "exact" })
      .eq("user_id", userId)
      .order("placed_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      data: {
        orders: orders || [],
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

// GET /api/orders/:id - Own order detail
router.get("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { data: order, error } = await req.supabase!
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found or unauthorized");
    }

    res.json({ data: order, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/:id/cancel - Cancel own order via atomic cancel_order RPC
router.post("/:id/cancel", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Call atomic cancel_order RPC via service role
    const { error: cancelError } = await supabaseAdmin.rpc("cancel_order", {
      p_order_id: id,
      p_actor: userId,
      p_is_admin: false,
    });

    if (cancelError) {
      throw new ApiError(400, "CANCEL_FAILED", cancelError.message);
    }

    // Return updated order
    const { data: updated } = await req.supabase!
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", id)
      .single();

    res.json({ data: updated, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
