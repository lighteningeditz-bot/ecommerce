import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { AuthenticatedRequest } from "./auth";

const rateLimitHandler = (_req: any, res: any) => {
  res.status(429).json({
    data: null,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please slow down and try again later.",
    },
  });
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.RATE_LIMIT_GLOBAL_PER_15MIN,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const aiIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: env.AI_RATE_LIMIT_IP_PER_10MIN,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const aiUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.AI_RATE_LIMIT_USER_PER_HOUR,
  keyGenerator: (req: AuthenticatedRequest) => req.user?.id || req.ip || "unknown",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const adminAiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.AI_RATE_LIMIT_ADMIN_PER_HOUR,
  keyGenerator: (req: AuthenticatedRequest) => req.user?.id || req.ip || "admin",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
