import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Security assertion: Ensure no client-facing VITE_ env var leaks secrets
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("VITE_") && typeof value === "string") {
    if (
      value.toLowerCase().includes("service_role") ||
      value.toLowerCase().includes("gemini")
    ) {
      throw new Error(
        `FATAL SECURITY VIOLATION: Secret leaked in client variable ${key}. Server halting.`
      );
    }
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),

  // Supabase
  SUPABASE_URL: z.string().url().default("https://placeholder-project.supabase.co"),
  SUPABASE_ANON_KEY: z.string().min(1).default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default("placeholder-service-role-key"),

  // Gemini AI
  GEMINI_API_KEY: z.string().default("dummy-gemini-key"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  // Rate Limiting
  RATE_LIMIT_GLOBAL_PER_15MIN: z.coerce.number().default(300),
  AI_RATE_LIMIT_IP_PER_10MIN: z.coerce.number().default(10),
  AI_RATE_LIMIT_USER_PER_HOUR: z.coerce.number().default(20),
  AI_RATE_LIMIT_ADMIN_PER_HOUR: z.coerce.number().default(30),

  // Business Rules
  MAX_LISTING_PRICE_INR: z.coerce.number().default(2500),
  FREE_SHIPPING_THRESHOLD_INR: z.coerce.number().default(499),
  FLAT_SHIPPING_INR: z.coerce.number().default(40),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid environment configuration. Check your .env file.");
}

export const env = parsed.data;
