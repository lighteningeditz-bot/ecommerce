import { Router, Response, NextFunction } from "express";
import { listingInputSchema } from "@kalakart/shared";
import { AuthenticatedRequest } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { adminAiLimiter } from "../../middleware/rateLimit";
import { runListingGenerator } from "../../ai/listingGenerator";

const router = Router();
router.use(adminAiLimiter);

// POST /api/admin/ai/listing - AI Listing Generator
router.post(
  "/listing",
  validate({ body: listingInputSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await runListingGenerator(req.body, req.user?.id);
      res.json({ data: result, error: null });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
