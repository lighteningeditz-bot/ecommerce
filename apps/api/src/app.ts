import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { env } from "./config/env";
import { httpLogger } from "./lib/logger";
import { globalLimiter } from "./middleware/rateLimit";
import { errorHandler, ApiError } from "./middleware/errorHandler";
import { requireAuth, requireAdmin } from "./middleware/auth";

// Route imports
import healthRoutes from "./routes/health";
import catalogRoutes from "./routes/catalog";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import addressesRoutes from "./routes/addresses";
import ordersRoutes from "./routes/orders";
import reviewsRoutes from "./routes/reviews";
import meRoutes from "./routes/me";
import aiRoutes from "./routes/ai";

// Admin route imports
import adminStatsRoutes from "./routes/admin/stats";
import adminProductsRoutes from "./routes/admin/products";
import adminCategoriesRoutes from "./routes/admin/categories";
import adminOrdersRoutes from "./routes/admin/orders";
import adminUploadsRoutes from "./routes/admin/uploads";
import adminAiRoutes from "./routes/admin/ai";

export function createApp(): Express {
  const app = express();

  // Basic security & hardening
  app.disable("x-powered-by");

  // Helmet with customized Content Security Policy
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://picsum.photos",
            "https://fastly.picsum.photos",
            env.SUPABASE_URL,
          ],
          connectSrc: ["'self'", env.SUPABASE_URL, env.CLIENT_ORIGIN],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [env.CLIENT_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    })
  );

  // Compression
  app.use(compression());

  // Request logger
  app.use(httpLogger);

  // Body parser with 100 KB limit to prevent payload flooding
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // Global rate limiter
  app.use(globalLimiter);

  // Public & Customer Routes under /api
  app.use("/api", healthRoutes);
  app.use("/api", catalogRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/addresses", addressesRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/products", reviewsRoutes);
  app.use("/api/reviews", reviewsRoutes);
  app.use("/api/me", meRoutes);
  app.use("/api/ai", aiRoutes);

  // Admin Routes (Defense-in-depth: Protected by requireAuth AND requireAdmin)
  const adminRouter = express.Router();
  adminRouter.use(requireAuth);
  adminRouter.use(requireAdmin);

  adminRouter.use("/stats", adminStatsRoutes);
  adminRouter.use("/products", adminProductsRoutes);
  adminRouter.use("/categories", adminCategoriesRoutes);
  adminRouter.use("/orders", adminOrdersRoutes);
  adminRouter.use("/uploads", adminUploadsRoutes);
  adminRouter.use("/product-images", adminUploadsRoutes);
  adminRouter.use("/ai", adminAiRoutes);

  app.use("/api/admin", adminRouter);

  // 404 Catch-all
  app.use((_req, _res, next) => {
    next(new ApiError(404, "NOT_FOUND", "The requested API endpoint was not found"));
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
