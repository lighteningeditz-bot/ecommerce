import { GoogleGenAI, Type } from "@google/genai";
import { z, ZodTypeAny } from "zod";
import { env } from "../config/env";
import { aiCircuitBreaker } from "./circuitBreaker";
import { logger } from "./logger";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export { Type };

export interface GeminiJsonOptions<T extends ZodTypeAny> {
  systemInstruction: string;
  userPrompt: string;
  responseSchema: Record<string, unknown>;
  zodSchema: T;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

export interface GeminiResult<T> {
  ok: boolean;
  data: T | null;
  zodError: z.ZodError | null;
  raw: string;
  latencyMs: number;
  promptTokens: number | null;
  outputTokens: number | null;
  status: "success" | "validation_error" | "provider_error" | "blocked";
}

function safeJsonParse(s: string): unknown {
  try {
    return JSON.parse(s.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return null;
  }
}

export async function generateJson<T extends ZodTypeAny>(
  opts: GeminiJsonOptions<T>
): Promise<GeminiResult<z.infer<T>>> {
  const started = Date.now();

  if (aiCircuitBreaker.isOpen()) {
    logger.warn({ msg: "Circuit breaker OPEN: refusing AI request immediately" });
    return {
      ok: false,
      data: null,
      zodError: null,
      raw: "",
      latencyMs: Date.now() - started,
      promptTokens: null,
      outputTokens: null,
      status: "provider_error",
    };
  }

  // Attempt initial generation
  const res = await callGeminiOnce(opts, opts.userPrompt);
  if (res.ok) {
    aiCircuitBreaker.recordSuccess();
    return res;
  }

  // If blocked or provider error, record and return
  if (res.status === "blocked" || res.status === "provider_error") {
    aiCircuitBreaker.recordFailure(res.raw);
    return res;
  }

  // On schema validation error, retry ONCE with repair instruction
  logger.info({ msg: "AI response failed validation; attempting one repair retry" });
  const repairPrompt = `${opts.userPrompt}\n\nIMPORTANT: Your previous output failed schema validation: ${JSON.stringify(
    res.zodError?.format()
  )}. Correct all mistakes and return strictly valid JSON matching the exact schema.`;

  const retryRes = await callGeminiOnce(opts, repairPrompt);
  if (retryRes.ok) {
    aiCircuitBreaker.recordSuccess();
    return retryRes;
  }

  aiCircuitBreaker.recordFailure("Repair retry failed validation");
  return retryRes;
}

async function callGeminiOnce<T extends ZodTypeAny>(
  opts: GeminiJsonOptions<T>,
  promptText: string
): Promise<GeminiResult<z.infer<T>>> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 25_000);

  try {
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: promptText,
      config: {
        systemInstruction: opts.systemInstruction,
        responseMimeType: "application/json",
        responseSchema: opts.responseSchema as any,
        temperature: opts.temperature ?? 0.4,
        maxOutputTokens: opts.maxOutputTokens ?? 2048,
        abortSignal: controller.signal,
      },
    });

    const raw = response.text ?? "";
    const parsedJson = safeJsonParse(raw);

    if (!parsedJson) {
      return {
        ok: false,
        data: null,
        zodError: null,
        raw,
        latencyMs: Date.now() - started,
        promptTokens: response.usageMetadata?.promptTokenCount ?? null,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
        status: "validation_error",
      };
    }

    const result = opts.zodSchema.safeParse(parsedJson);
    const usage = response.usageMetadata;

    return {
      ok: result.success,
      data: result.success ? result.data : null,
      zodError: result.success ? null : result.error,
      raw,
      latencyMs: Date.now() - started,
      promptTokens: usage?.promptTokenCount ?? null,
      outputTokens: usage?.candidatesTokenCount ?? null,
      status: result.success ? "success" : "validation_error",
    };
  } catch (err: any) {
    const isAbort = err?.name === "AbortError";
    const isSafety =
      err?.message?.toLowerCase().includes("safety") ||
      err?.message?.toLowerCase().includes("blocked");

    return {
      ok: false,
      data: null,
      zodError: null,
      raw: String(err?.message || err),
      latencyMs: Date.now() - started,
      promptTokens: null,
      outputTokens: null,
      status: isSafety ? "blocked" : isAbort ? "provider_error" : "provider_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
