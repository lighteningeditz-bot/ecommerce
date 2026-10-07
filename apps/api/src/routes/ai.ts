import { Router, Response, NextFunction } from "express";
import { giftAdvisorInputSchema, productQaInputSchema } from "@kalakart/shared";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { aiIpLimiter, aiUserLimiter } from "../middleware/rateLimit";
import { runGiftAdvisor } from "../ai/giftAdvisor";
import { runProductQa } from "../ai/productQa";

const router = Router();
router.use(optionalAuth);
router.use(aiIpLimiter);
router.use(aiUserLimiter);

// POST /api/ai/gift-advisor
router.post(
  "/gift-advisor",
  validate({ body: giftAdvisorInputSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await runGiftAdvisor(req.body, req.user?.id);
      res.json({ data: result, error: null });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/ai/product-qa
router.post(
  "/product-qa",
  validate({ body: productQaInputSchema }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await runProductQa(req.body, req.user?.id);
      res.json({ data: result, error: null });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
