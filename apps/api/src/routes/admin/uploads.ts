import { Router, Response, NextFunction } from "express";
import crypto from "crypto";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { supabaseAdmin } from "../../lib/supabase";
import { ApiError } from "../../middleware/errorHandler";

const router = Router();

const signUploadSchema = z.object({
  filename: z.string().min(1).max(200),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    errorMap: () => ({ message: "Only JPEG, PNG, and WebP images are allowed" }),
  }),
});

const registerImageSchema = z.object({
  url: z.string().url(),
  alt_text: z.string().max(150).optional(),
  sort_order: z.coerce.number().int().default(0),
});

// POST /api/admin/uploads/sign - Create signed upload URL for product-images
router.post(
  "/sign",
  validate({ body: signUploadSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { mimeType } = req.body;
      const ext = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : "webp";
      const key = `products/${crypto.randomUUID()}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from("product-images")
        .createSignedUploadUrl(key);

      if (error || !data) {
        throw new ApiError(500, "STORAGE_ERROR", error?.message || "Failed to generate signed upload URL");
      }

      // Public URL where the image will be accessible after upload
      const { data: publicData } = supabaseAdmin.storage.from("product-images").getPublicUrl(key);

      res.json({
        data: {
          signedUrl: data.signedUrl,
          token: data.token,
          path: data.path,
          publicUrl: publicData.publicUrl,
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/admin/products/:id/images - Register uploaded image with product
router.post(
  "/:id/images",
  validate({ body: registerImageSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { url, alt_text, sort_order } = req.body;

      const { data, error } = await supabaseAdmin
        .from("product_images")
        .insert({
          product_id: id,
          url,
          alt_text: alt_text || null,
          sort_order: sort_order || 0,
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

// DELETE /api/admin/product-images/:id - Delete product image
router.delete("/images/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from("product_images").delete().eq("id", id);
    if (error) throw error;

    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
});

export default router;
