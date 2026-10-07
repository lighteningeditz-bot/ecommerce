import { Type } from "@google/genai";
import { ListingInput, listingOutputSchema, ListingOutput } from "@kalakart/shared";
import { generateJson } from "../lib/gemini";
import { KALA_SYSTEM_PROMPT } from "./systemPrompt";
import { sanitizeUserInput } from "./sanitize";
import { supabaseAdmin } from "../lib/supabase";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const listingResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    short_description: { type: Type.STRING },
    description: { type: Type.STRING },
    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    care_instructions: { type: Type.STRING },
    seo_title: { type: Type.STRING },
    seo_description: { type: Type.STRING },
    suggested_price_inr: { type: Type.INTEGER },
    price_rationale: { type: Type.STRING },
    affordability_warning: { type: Type.STRING },
  },
  required: [
    "title",
    "short_description",
    "description",
    "highlights",
    "tags",
    "care_instructions",
    "seo_title",
    "seo_description",
    "suggested_price_inr",
    "price_rationale",
    "affordability_warning",
  ],
};

export async function runListingGenerator(
  input: ListingInput,
  adminUserId?: string
): Promise<ListingOutput & { suggested_slug: string }> {
  // 1. Fetch category and price context
  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .eq("slug", input.category_slug)
    .single();

  const categoryName = cat?.name || "Handmade Crafts";

  let minPrice = 99;
  let maxPrice = 999;
  let avgPrice = 349;

  if (cat?.id) {
    const { data: existingProds } = await supabaseAdmin
      .from("products")
      .select("price_inr")
      .eq("category_id", cat.id)
      .limit(20);

    if (existingProds && existingProds.length > 0) {
      const prices = existingProds.map((p) => Number(p.price_inr));
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
      avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    }
  }

  const systemInstruction = `${KALA_SYSTEM_PROMPT}

TASK: PRODUCT LISTING GENERATOR (ADMIN)
Create a complete, honest, SEO-friendly listing for a handmade craft product using the maker's keywords and notes.
- Title: 3 to 12 words, descriptive, no ALL CAPS, no keyword stuffing.
- short_description: max 160 characters.
- description: 80 to 160 words, 2 short paragraphs, mentions materials and use cases. Do NOT claim anything not supported by the provided inputs (no "eco-certified", "organic", "waterproof" unless the maker said so).
- highlights: 3 to 5 short bullet phrases.
- tags: 5 to 10 lowercase single or two-word tags.
- care_instructions: 1 to 3 sentences, safe and generic unless the maker specified.
- seo_title: max 60 characters. seo_description: max 155 characters.
- suggested_price_inr: an integer. It must be AFFORDABLE: at or below max_listing_price_inr (${env.MAX_LISTING_PRICE_INR} INR), close to the category's typical range in <price_context>, and if cost_price_inr and target_margin_percent are given, at least cost_price_inr * (1 + margin/100) rounded up to a "friendly" price (ending in 9 or 49/99 where sensible), but never above the cap.
- price_rationale: 1 to 2 sentences explaining the suggestion.
- affordability_warning: if the margin-based price would exceed the cap or be far above the category range, return a helpful warning; otherwise an empty string.`;

  const userPrompt = `<store_facts>
max_listing_price_inr: ${env.MAX_LISTING_PRICE_INR}
currency: INR
</store_facts>
<price_context>
category: ${categoryName}
existing_min: ${minPrice} existing_avg: ${avgPrice} existing_max: ${maxPrice}
</price_context>
<maker_inputs>
cost_price_inr: ${input.cost_price_inr ?? "unknown"}
target_margin_percent: ${input.target_margin_percent}
</maker_inputs>
<user_input>
keywords: ${sanitizeUserInput(input.keywords, 200)}
materials: ${sanitizeUserInput(input.materials, 150) || "unspecified"}
dimensions: ${sanitizeUserInput(input.dimensions, 80) || "unspecified"}
maker_note: ${sanitizeUserInput(input.maker_note, 400) || "none"}
</user_input>

Return JSON only.`;

  const aiResult = await generateJson({
    systemInstruction,
    userPrompt,
    responseSchema: listingResponseSchema,
    zodSchema: listingOutputSchema,
    temperature: 0.7,
    maxOutputTokens: 1400,
  });

  // Log to ai_requests
  try {
    await supabaseAdmin.from("ai_requests").insert({
      user_id: adminUserId || null,
      feature: "listing_generator",
      model: env.GEMINI_MODEL,
      input_json: input,
      output_json: aiResult.data,
      status: aiResult.status,
      latency_ms: aiResult.latencyMs,
      prompt_tokens: aiResult.promptTokens,
      output_tokens: aiResult.outputTokens,
    });
  } catch (err) {
    logger.error({ msg: "Failed to log listing_generator ai_request", err });
  }

  let finalData: ListingOutput;

  if (aiResult.ok && aiResult.data) {
    finalData = aiResult.data;
  } else {
    // Graceful fallback if AI offline
    const rawCost = input.cost_price_inr || 150;
    const calcPrice = Math.min(
      env.MAX_LISTING_PRICE_INR,
      Math.max(49, Math.round(rawCost * (1 + (input.target_margin_percent || 25) / 100)))
    );

    finalData = {
      title: `Handcrafted ${input.keywords}`,
      short_description: `Artisanal handmade ${input.keywords} made with authentic craft techniques.`,
      description: `Skillfully crafted by regional artisans, this piece highlights the natural beauty and texture of handcrafted artistry. Ideal for mindful homes and sustainable living spaces.\n\nEach item is made individually with dedication, bringing traditional warmth and functional beauty to your everyday moments.`,
      highlights: [
        "100% handmade by local artisans",
        "Durable, natural, and eco-conscious construction",
        "Unique handcrafted texture on every piece",
      ],
      tags: [input.category_slug, "handmade", "artisan", "craft", "eco-friendly"],
      care_instructions: "Wipe gently with a dry, clean cloth. Avoid harsh chemicals and moisture.",
      seo_title: `Handcrafted ${input.keywords} | KalaKart`,
      seo_description: `Authentic handcrafted ${input.keywords}. Affordable, sustainable handmade crafts under ₹${calcPrice}.`,
      suggested_price_inr: calcPrice,
      price_rationale: "Estimated from baseline category margins and cost input.",
      affordability_warning: "",
    };
  }

  // Enforce Hard Affordability Rule: Clamp suggested price to <= MAX_LISTING_PRICE_INR
  const clampedPrice = Math.min(
    env.MAX_LISTING_PRICE_INR,
    Math.max(1, finalData.suggested_price_inr)
  );

  let warning = finalData.affordability_warning;
  if (finalData.suggested_price_inr > env.MAX_LISTING_PRICE_INR) {
    warning = `Notice: Price was clamped to KalaKart's affordability ceiling of ₹${env.MAX_LISTING_PRICE_INR}.`;
  }

  // Generate URL slug from title
  const baseSlug = finalData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
  const suggested_slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    ...finalData,
    title: finalData.title.slice(0, 140),
    short_description: finalData.short_description.slice(0, 160),
    care_instructions: finalData.care_instructions.slice(0, 500),
    seo_title: finalData.seo_title.slice(0, 70),
    seo_description: finalData.seo_description.slice(0, 160),
    suggested_price_inr: clampedPrice,
    affordability_warning: warning,
    suggested_slug,
  };
}
