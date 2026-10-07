import { Router, Response, NextFunction } from "express";
import { orderStatusUpdateSchema, ALLOWED_ORDER_TRANSITIONS, OrderStatus } from "@kalakart/shared";
import { AuthenticatedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { supabaseAdmin } from "../../lib/supabase";
import { ApiError } from "../../middleware/errorHandler";

const router = Router();

// GET /api/admin/orders - List all orders with filters
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 20)));

    let query = supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*), profile:profiles(full_name, phone)", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: orders, count, error } = await query
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

// GET /api/admin/orders/:id - Order detail
router.get("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*), profile:profiles(full_name, phone)")
      .eq("id", id)
      .single();

    if (error || !order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found");
    }

    res.json({ data: order, error: null });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/orders/:id/status - Update status with transition rules
router.patch(
  "/:id/status",
  validate({ body: orderStatusUpdateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status: targetStatus } = req.body as { status: OrderStatus };

      // 1. Fetch current order
      const { data: currentOrder, error: fetchErr } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr || !currentOrder) {
        throw new ApiError(404, "ORDER_NOT_FOUND", "Order not found");
      }

      const currentStatus = currentOrder.status as OrderStatus;

      // If status is already target, return immediately
      if (currentStatus === targetStatus) {
        res.json({ data: currentOrder, error: null });
        return;
      }

      // 2. Validate allowed status transition
      const allowedNext = ALLOWED_ORDER_TRANSITIONS[currentStatus] || [];
      if (!allowedNext.includes(targetStatus)) {
        throw new ApiError(
          400,
          "INVALID_STATUS_TRANSITION",
          `Cannot transition order from '${currentStatus}' to '${targetStatus}'. Allowed transitions: ${allowedNext.join(", ") || "none"}`
        );
      }

      // 3. Handle cancellation via atomic cancel_order RPC
      if (targetStatus === "cancelled") {
        const { error: cancelErr } = await supabaseAdmin.rpc("cancel_order", {
          p_order_id: id,
          p_actor: req.user!.id,
          p_is_admin: true,
        });

        if (cancelErr) {
          throw new ApiError(400, "CANCELLATION_FAILED", cancelErr.message);
        }

        const { data: cancelledOrder } = await supabaseAdmin
          .from("orders")
          .select("*, items:order_items(*)")
          .eq("id", id)
          .single();

        res.json({ data: cancelledOrder, error: null });
        return;
      }

      // 4. Update status (and mark COD as paid upon delivery)
      const updates: Record<string, any> = {
        status: targetStatus,
      };

      if (targetStatus === "delivered" && currentOrder.payment_method === "cod") {
        updates.payment_status = "paid";
      }

      const { data: updatedOrder, error: updateErr } = await supabaseAdmin
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select("*, items:order_items(*)")
        .single();

      if (updateErr) throw updateErr;

      res.json({ data: updatedOrder, error: null });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
