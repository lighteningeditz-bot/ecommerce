import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "kalakart-api",
      uptime: process.uptime(),
    },
    error: null,
  });
});

export default router;
