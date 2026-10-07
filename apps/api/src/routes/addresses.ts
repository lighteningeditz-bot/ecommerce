import { Router, Response, NextFunction } from "express";
import { addressSchema } from "@kalakart/shared";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// GET /api/addresses
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await req.supabase!
      .from("addresses")
      .select("*")
      .eq("user_id", req.user!.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ data: data || [], error: null });
  } catch (err) {
    next(err);
  }
});

// POST /api/addresses
router.post(
  "/",
  validate({ body: addressSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const addrData = req.body;

      // If set as default, reset other default addresses for this user
      if (addrData.is_default) {
        await req.supabase!
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      } else {
        // If this is the user's first address, make it default automatically
        const { count } = await req.supabase!
          .from("addresses")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if ((count || 0) === 0) {
          addrData.is_default = true;
        }
      }

      const { data, error } = await req.supabase!
        .from("addresses")
        .insert({
          ...addrData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/addresses/:id
router.patch(
  "/:id",
  validate({ body: addressSchema.partial() }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updates = req.body;

      if (updates.is_default) {
        await req.supabase!
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { data, error } = await req.supabase!
        .from("addresses")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error || !data) {
        throw new ApiError(404, "ADDRESS_NOT_FOUND", "Address not found or update unauthorized");
      }

      res.json({ data, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/addresses/:id
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { error } = await req.supabase!
      .from("addresses")
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
