import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { env } from "../config/env";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const reqId = (req as any).id || (req.headers["x-request-id"] as string) || "unknown";

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.warn({ reqId, msg: "Validation error", issues: err.issues });
    res.status(400).json({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ") || "Invalid input data",
        details: err.format(),
      },
    });
    return;
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    logger.warn({ reqId, code: err.code, msg: err.message, details: err.details });
    res.status(err.statusCode).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle 404 Route Not Found
  if (err.status === 404 || err.statusCode === 404) {
    res.status(404).json({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: err.message || "Endpoint not found",
      },
    });
    return;
  }

  // Unhandled / 500 error
  logger.error({ reqId, msg: "Unhandled server error", err: err?.stack || String(err) });
  res.status(err.statusCode || 500).json({
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "An unexpected error occurred. Please try again later."
          : err.message || "Internal server error",
      details: env.NODE_ENV !== "production" ? err.stack : undefined,
    },
  });
}
