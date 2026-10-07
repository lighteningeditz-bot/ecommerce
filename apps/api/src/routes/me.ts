import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { cleanText } from "@kalakart/shared";
import { ApiError } from "../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

const profileUpdateSchema = z.object({
  full_name: cleanText(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").optional().nullable(),
});

// GET /api/me - Profile + role
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { data: profile, error } = await req.supabase!
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      throw new ApiError(404, "PROFILE_NOT_FOUND", "User profile not found");
    }

    res.json({
      data: {
        ...profile,
        email: req.user!.email,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/me - Update name & phone
router.patch(
  "/",
  validate({ body: profileUpdateSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { full_name, phone } = req.body;

      const updates: Record<string, any> = {};
      if (full_name !== undefined) updates.full_name = full_name;
      if (phone !== undefined) updates.phone = phone;

      const { data: profile, error } = await req.supabase!
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        data: {
          ...profile,
          email: req.user!.email,
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
