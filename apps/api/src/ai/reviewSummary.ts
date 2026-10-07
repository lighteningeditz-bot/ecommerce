import { Type } from "@google/genai";
import { reviewSummaryOutputSchema, ReviewSummaryOutput } from "@kalakart/shared";
import { generateJson } from "../lib/gemini";
import { KALA_SYSTEM_PROMPT } from "./systemPrompt";
import { supabaseAdmin } from "../lib/supabase";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const reviewSummaryResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overview: { type: Type.STRING },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    sentiment: { type: Type.STRING, enum: ["positive", "mixed", "negative"] },
  },
  required: ["overview", "pros", "cons", "sentiment"],
};

export async function getOrGenerateReviewSummary(
  productSlug: string
): Promise<{ summary: ReviewSummaryOutput | null }> {
  // 1. Fetch product
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("id, title, review_count, ai_review_summary, ai_review_summary_count")
    .eq("slug", productSlug)
    .single();

  if (error || !product) {
    return { summary: null };
  }

  // If fewer than 3 reviews, return null without calling AI
  if (product.review_count < 3) {
    return { summary: null };
  }

  // Check cache: refresh only when review count changes by 5 or more
  if (
    product.ai_review_summary &&
    product.review_count - product.ai_review_summary_count < 5
  ) {
    return { summary: product.ai_review_summary as ReviewSummaryOutput };
  }

  // Fetch up to 30 most recent reviews
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("rating, body")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (!reviews || reviews.length < 3) {
    return { summary: null };
  }

  const reviewList = reviews.map((r) => ({
    rating: r.rating,
    comment: (r.body || "").slice(0, 300),
  }));

  const systemInstruction = `${KALA_SYSTEM_PROMPT}

TASK: REVIEW SUMMARIZER
Summarize customer sentiment ONLY from the reviews inside <reviews>. Be balanced and factual.
- "overview": 1 to 2 sentences.
- "pros": 2 to 4 short phrases that multiple reviewers actually mention.
- "cons": 0 to 3 short phrases that reviewers actually mention. Do not invent cons.
- Never quote reviewer names. Do not exaggerate.`;

  const userPrompt = `<product_title>${product.title}</product_title>
<reviews>
${JSON.stringify(reviewList, null, 2)}
</reviews>

Return JSON only.`;

  const aiResult = await generateJson({
    systemInstruction,
    userPrompt,
    responseSchema: reviewSummaryResponseSchema,
    zodSchema: reviewSummaryOutputSchema,
    temperature: 0.2,
    maxOutputTokens: 500,
  });

  // Log to ai_requests
  try {
    await supabaseAdmin.from("ai_requests").insert({
      feature: "review_summary",
      model: env.GEMINI_MODEL,
      input_json: { product_slug: productSlug, review_count: product.review_count },
      output_json: aiResult.data,
      status: aiResult.status,
      latency_ms: aiResult.latencyMs,
      prompt_tokens: aiResult.promptTokens,
      output_tokens: aiResult.outputTokens,
    });
  } catch (err) {
    logger.error({ msg: "Failed to log review_summary ai_request", err });
  }

  if (aiResult.ok && aiResult.data) {
    // Cache the validated summary in the database
    await supabaseAdmin
      .from("products")
      .update({
        ai_review_summary: aiResult.data,
        ai_review_summary_count: product.review_count,
      })
      .eq("id", product.id);

    return { summary: aiResult.data };
  }

  // Return existing cached summary if available on AI failure
  return { summary: (product.ai_review_summary as ReviewSummaryOutput) || null };
}
