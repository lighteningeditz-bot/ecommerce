import { Type } from "@google/genai";
import { ProductQaInput, productQaOutputSchema, ProductQaOutput } from "@kalakart/shared";
import { generateJson } from "../lib/gemini";
import { KALA_SYSTEM_PROMPT } from "./systemPrompt";
import { sanitizeUserInput } from "./sanitize";
import { supabaseAdmin } from "../lib/supabase";
import { env } from "../config/env";
import { logger } from "../lib/logger";

export const productQaResponseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING },
    answerable: { type: Type.BOOLEAN },
    follow_ups: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["answer", "answerable"],
};

export async function runProductQa(
  input: ProductQaInput,
  userId?: string
): Promise<ProductQaOutput> {
  // 1. Fetch product data
  const { data: product, error: prodErr } = await supabaseAdmin
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", input.productSlug)
    .eq("is_published", true)
    .single();

  if (prodErr || !product) {
    return {
      answer: "We could not find information for this product in our current catalog.",
      answerable: false,
      follow_ups: [],
    };
  }

  // 2. Fetch top 5 recent reviews
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("rating, body")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const productData = {
    title: product.title,
    category: product.category?.name,
    price_inr: product.price_inr,
    stock_status: product.stock_qty > 0 ? "In Stock" : "Out of Stock",
    materials: product.materials,
    dimensions: product.dimensions,
    care_instructions: product.care_instructions,
    maker_story: product.maker_story,
    description: product.description,
    highlights: product.highlights,
    customer_reviews: (reviews || []).map((r) => ({
      rating: r.rating,
      comment: r.body?.slice(0, 200),
    })),
  };

  const sanitizedQuestion = sanitizeUserInput(input.question, 300);

  const systemInstruction = `${KALA_SYSTEM_PROMPT}

TASK: PRODUCT Q&A
Answer the shopper's question about the ONE product in <product>. Use ONLY facts present in <product>.
- If the answer is not in the data, set "answerable" to false and say politely that the maker details don't include it, and suggest contacting support or checking the description.
- Keep the answer under 80 words, plain and friendly.
- Never promise delivery dates, discounts, custom orders, or stock beyond what is in <product>.
- Provide up to 2 short follow-up question suggestions that ARE answerable from <product>.`;

  const userPrompt = `<product>
${JSON.stringify(productData, null, 2)}
</product>

<user_input>
${sanitizedQuestion}
</user_input>

Return JSON only.`;

  const aiResult = await generateJson({
    systemInstruction,
    userPrompt,
    responseSchema: productQaResponseSchema,
    zodSchema: productQaOutputSchema,
    temperature: 0.2,
    maxOutputTokens: 400,
  });

  // Log to ai_requests
  try {
    await supabaseAdmin.from("ai_requests").insert({
      user_id: userId || null,
      feature: "product_qa",
      model: env.GEMINI_MODEL,
      input_json: input,
      output_json: aiResult.data,
      status: aiResult.status,
      latency_ms: aiResult.latencyMs,
      prompt_tokens: aiResult.promptTokens,
      output_tokens: aiResult.outputTokens,
    });
  } catch (err) {
    logger.error({ msg: "Failed to log product_qa ai_request", err });
  }

  if (!aiResult.ok || !aiResult.data) {
    return {
      answer: "I am currently unable to check this product's details. Please refer to the specifications listed above or contact our team.",
      answerable: false,
      follow_ups: ["What are the dimensions?", "How should I clean this craft?"],
    };
  }

  return aiResult.data;
}
