import { Type } from "@google/genai";
import {
  GiftAdvisorInput,
  giftAdvisorOutputSchema,
  GiftAdvisorHydratedResult,
  Product,
} from "@kalakart/shared";
import { generateJson } from "../lib/gemini";
import { KALA_SYSTEM_PROMPT } from "./systemPrompt";
import { sanitizeUserInput } from "./sanitize";
import { supabaseAdmin } from "../lib/supabase";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const giftAdvisorResponseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          product_id: { type: Type.STRING },
          rank: { type: Type.INTEGER },
          reason: { type: Type.STRING },
          fit_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["product_id", "rank", "reason"],
      },
    },
    bundle: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        title: { type: Type.STRING },
        product_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
        rationale: { type: Type.STRING },
      },
      required: ["title", "product_ids", "rationale"],
    },
    budget_tip: { type: Type.STRING },
    note: { type: Type.STRING },
  },
  required: ["recommendations", "budget_tip"],
};

export async function runGiftAdvisor(
  input: GiftAdvisorInput,
  userId?: string
): Promise<GiftAdvisorHydratedResult> {
  const started = Date.now();

  // 1. Retrieve candidates strictly adhering to budget and stock
  let query = supabaseAdmin
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("is_published", true)
    .gt("stock_qty", 0)
    .lte("price_inr", input.budget_inr);

  if (input.preferred_categories && input.preferred_categories.length > 0) {
    const { data: matchedCats } = await supabaseAdmin
      .from("categories")
      .select("id")
      .in("slug", input.preferred_categories);
    const catIds = matchedCats?.map((c) => c.id) || [];
    if (catIds.length > 0) {
      query = query.in("category_id", catIds);
    }
  }

  let { data: candidates, error } = await query
    .order("avg_rating", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(40);

  // If fewer than 6, relax the category filter (NEVER relax the budget)
  if (!candidates || candidates.length < 6) {
    const fallbackRes = await supabaseAdmin
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("is_published", true)
      .gt("stock_qty", 0)
      .lte("price_inr", input.budget_inr)
      .order("avg_rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(40);

    candidates = fallbackRes.data || [];
  }

  // If still no candidates exist under budget, return fallback notice
  if (!candidates || candidates.length === 0) {
    return generateFallbackResult(input, [], "No items found matching the stated budget.");
  }

  const candidateMap = new Map<string, Product>();
  candidates.forEach((p) => candidateMap.set(p.id, p as unknown as Product));

  const compactCatalog = candidates.map((p) => ({
    id: p.id,
    title: p.title,
    short_description: p.short_description,
    category: p.category?.name || "Craft",
    price_inr: Number(p.price_inr),
    tags: p.tags,
    materials: p.materials,
    avg_rating: Number(p.avg_rating),
  }));

  const sanitizedNotes = sanitizeUserInput(input.notes, 300);

  const featureInstruction = `${KALA_SYSTEM_PROMPT}

TASK: GIFT & CRAFT ADVISOR
Recommend between 3 and 6 products from <catalog> that best fit the shopper's purpose, occasion, recipient, interests, and notes.
- Rank from best to good fit.
- Every recommended product MUST be in <catalog> and priced at or below budget_inr (${input.budget_inr} INR).
- If total_budget_inr is provided (${input.total_budget_inr ?? "none"}), the "bundle" must have a combined price at or below total_budget_inr. Otherwise the bundle's combined price must not exceed ${
    input.budget_inr * 2
  } INR.
- "reason" must be 1 to 2 short sentences, specific to this shopper, grounded in the item's real tags/materials/description.
- Provide ONE bundle idea of 2 to 4 catalog items that go well together, with a short title and rationale.
- "budget_tip" is one practical money-saving or value tip (e.g., free shipping threshold of ₹${
    env.FREE_SHIPPING_THRESHOLD_INR
  }), based only on facts in <store_facts>.
- If fewer than 3 suitable products exist, return as many as are suitable and explain in "note".`;

  const userPrompt = `<store_facts>
currency: INR
free_shipping_threshold_inr: ${env.FREE_SHIPPING_THRESHOLD_INR}
flat_shipping_inr: ${env.FLAT_SHIPPING_INR}
</store_facts>

<shopper_profile>
purpose: ${input.purpose}
occasion: ${input.occasion}
recipient: ${input.recipient}
recipient_age_group: ${input.recipient_age_group || "unspecified"}
interests: ${input.interests.join(", ") || "none"}
budget_inr_per_item: ${input.budget_inr}
total_budget_inr: ${input.total_budget_inr || "not specified"}
number_of_gifts: ${input.quantity_of_gifts}
</shopper_profile>

<user_input>
${sanitizedNotes}
</user_input>

<catalog>
${JSON.stringify(compactCatalog)}
</catalog>

Return JSON only.`;

  const aiResult = await generateJson({
    systemInstruction: featureInstruction,
    userPrompt,
    responseSchema: giftAdvisorResponseSchema,
    zodSchema: giftAdvisorOutputSchema,
    temperature: 0.5,
    maxOutputTokens: 1500,
  });

  // Log request to ai_requests in database
  await logAiRequest({
    user_id: userId,
    feature: "gift_advisor",
    model: env.GEMINI_MODEL,
    input_json: input,
    output_json: aiResult.data,
    status: aiResult.status,
    latency_ms: aiResult.latencyMs,
    prompt_tokens: aiResult.promptTokens,
    output_tokens: aiResult.outputTokens,
  });

  if (!aiResult.ok || !aiResult.data) {
    logger.warn({ msg: "Gift advisor AI call failed or invalid; returning fallback", error: aiResult.zodError });
    return generateFallbackResult(input, candidates as unknown as Product[], "AI service unavailable; showing top-rated in-budget crafts.");
  }

  // Grounding Verification: Filter out products not in catalog or violating budget
  const verifiedRecs: Array<{ product: Product; rank: number; reason: string; fit_tags?: string[] }> = [];

  for (const rec of aiResult.data.recommendations) {
    const item = candidateMap.get(rec.product_id);
    if (item && item.price_inr <= input.budget_inr) {
      verifiedRecs.push({
        product: item,
        rank: rec.rank,
        reason: rec.reason,
        fit_tags: rec.fit_tags,
      });
    }
  }

  if (verifiedRecs.length === 0) {
    return generateFallbackResult(input, candidates as unknown as Product[], "Showing top-rated handmade crafts within your budget.");
  }

  // Validate and compute bundle total server-side
  let validatedBundle = null;
  if (aiResult.data.bundle && aiResult.data.bundle.product_ids?.length >= 2) {
    const bundleItems: Product[] = [];
    let computedTotal = 0;

    for (const pid of aiResult.data.bundle.product_ids) {
      const p = candidateMap.get(pid);
      if (p) {
        bundleItems.push(p);
        computedTotal += Number(p.price_inr);
      }
    }

    const bundleCap = input.total_budget_inr || input.budget_inr * 2;
    if (bundleItems.length >= 2 && computedTotal <= bundleCap) {
      validatedBundle = {
        title: aiResult.data.bundle.title,
        products: bundleItems,
        total_price_inr: computedTotal,
        rationale: aiResult.data.bundle.rationale,
      };
    }
  }

  return {
    recommendations: verifiedRecs.slice(0, 6),
    bundle: validatedBundle,
    budget_tip: aiResult.data.budget_tip || `Orders above ₹${env.FREE_SHIPPING_THRESHOLD_INR} qualify for free shipping!`,
    note: aiResult.data.note,
    source: "ai",
  };
}

function generateFallbackResult(
  input: GiftAdvisorInput,
  candidates: Product[],
  noteMsg: string
): GiftAdvisorHydratedResult {
  const topItems = candidates.slice(0, 4).map((p, idx) => ({
    product: p,
    rank: idx + 1,
    reason: `Popular handmade craft fitting your budget of ₹${input.budget_inr}.`,
    fit_tags: p.tags.slice(0, 3),
  }));

  let bundle = null;
  if (topItems.length >= 2) {
    const bItems = topItems.slice(0, 2).map((r) => r.product);
    const sum = bItems.reduce((acc, cur) => acc + Number(cur.price_inr), 0);
    bundle = {
      title: "Handmade Craft Gift Pair",
      products: bItems,
      total_price_inr: sum,
      rationale: "Curated popular handmade craft essentials that complement each other.",
    };
  }

  return {
    recommendations: topItems,
    bundle,
    budget_tip: `Tip: Free standard shipping is automatically applied on all orders above ₹${env.FREE_SHIPPING_THRESHOLD_INR}.`,
    note: noteMsg,
    source: "fallback",
  };
}

async function logAiRequest(data: {
  user_id?: string;
  feature: string;
  model: string;
  input_json: any;
  output_json: any;
  status: string;
  latency_ms: number;
  prompt_tokens: number | null;
  output_tokens: number | null;
}) {
  try {
    await supabaseAdmin.from("ai_requests").insert({
      user_id: data.user_id || null,
      feature: data.feature,
      model: data.model,
      input_json: data.input_json,
      output_json: data.output_json,
      status: data.status,
      latency_ms: data.latency_ms,
      prompt_tokens: data.prompt_tokens,
      output_tokens: data.output_tokens,
    });
  } catch (err) {
    logger.error({ msg: "Failed to log ai_request", err });
  }
}
