import { Router, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabaseAdmin } from "../../lib/supabase";

const router = Router();

// GET /api/admin/stats
router.get("/", async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Orders today
    const { count: ordersToday } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("placed_at", todayStart.toISOString());

    // 2. Revenue last 7 days (non-cancelled orders)
    const { data: revOrders } = await supabaseAdmin
      .from("orders")
      .select("total_inr")
      .neq("status", "cancelled")
      .gte("placed_at", sevenDaysAgo.toISOString());

    const revenue7Days = (revOrders || []).reduce(
      (sum, ord) => sum + Number(ord.total_inr || 0),
      0
    );

    // 3. Low stock count (items with stock <= 5)
    const { count: lowStockCount } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .lte("stock_qty", 5);

    // 4. Pending orders count
    const { count: pendingOrdersCount } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    res.json({
      data: {
        orders_today: ordersToday || 0,
        revenue_7_days: revenue7Days,
        low_stock_count: lowStockCount || 0,
        pending_orders_count: pendingOrdersCount || 0,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
