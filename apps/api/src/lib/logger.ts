import pino from "pino";
import pinoHttp from "pino-http";
import crypto from "crypto";
import { env } from "../config/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.body.phone",
      "req.body.line1",
      "req.body.line2",
      "req.body.pincode",
      "req.body.full_name",
      "*.phone",
      "*.line1",
      "*.pincode",
      "*.authorization",
      "*.password",
    ],
    censor: "[REDACTED]",
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      };
    },
  },
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    const existing = req.headers["x-request-id"];
    if (typeof existing === "string") return existing;
    return crypto.randomUUID();
  },
  autoLogging: env.NODE_ENV !== "test",
});
