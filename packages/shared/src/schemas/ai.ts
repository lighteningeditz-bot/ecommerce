import { z } from "zod";
import { cleanText, inrInt, uuid } from "./catalog";

// ---------- AI inputs ----------
export const giftAdvisorInputSchema = z
  .object({
    purpose: z.enum([
      "gift",
      "home_decor",
      "festival",
      "personal_use",
      "kids_activity",
      "diy_hobby",
    ]),
    occasion: z.enum([
      "birthday",
      "diwali",
      "raksha_bandhan",
      "wedding",
      "housewarming",
      "anniversary",
      "teachers_day",
      "christmas",
      "no_occasion",
      "other",
    ]),
    recipient: z.enum([
      "mother",
      "father",
      "partner",
      "friend",
      "sibling",
      "child",
      "colleague",
      "elderly",
      "myself",
      "other",
    ]),
    recipient_age_group: z.enum(["child_0_12", "teen", "adult", "senior"]).optional(),
    interests: z
      .array(
        z.enum([
          "plants",
          "kitchen",
          "reading",
          "fashion",
          "festive",
          "spiritual",
          "art",
          "eco_friendly",
          "minimal",
          "traditional",
          "modern",
        ])
      )
      .max(5)
      .default([]),
    budget_inr: inrInt(20, 2500),
    total_budget_inr: inrInt(20, 10000).optional(),
    preferred_categories: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(9).default([]),
    notes: cleanText(300).optional(),
    quantity_of_gifts: inrInt(1, 10).default(1),
  })
  .refine((v) => v.total_budget_inr == null || v.total_budget_inr >= v.budget_inr, {
    message: "Total budget must be >= per-item budget",
    path: ["total_budget_inr"],
  });

export const productQaInputSchema = z.object({
  productSlug: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().trim().min(3).max(300),
});

export const listingInputSchema = z.object({
  keywords: cleanText(200).pipe(z.string().min(3)),
  category_slug: z.string().regex(/^[a-z0-9-]+$/),
  materials: cleanText(150).optional(),
  dimensions: cleanText(80).optional(),
  maker_note: cleanText(400).optional(),
  cost_price_inr: z.coerce.number().min(0).max(2500).optional(),
  target_margin_percent: z.coerce.number().min(5).max(60).default(25),
});

// ---------- AI outputs (validated server-side after Gemini responds) ----------
export const giftAdvisorOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        product_id: uuid,
        rank: z.number().int().min(1).max(6),
        reason: z.string().min(5).max(300),
        fit_tags: z.array(z.string().max(30)).max(5).optional(),
      })
    )
    .min(1)
    .max(6),
  bundle: z
    .object({
      title: z.string().min(3).max(80),
      product_ids: z.array(uuid).min(2).max(4),
      rationale: z.string().min(5).max(300),
    })
    .nullable()
    .optional(),
  budget_tip: z.string().min(3).max(240),
  note: z.string().max(300).optional(),
});

export const productQaOutputSchema = z.object({
  answer: z.string().min(1).max(600),
  answerable: z.boolean(),
  follow_ups: z.array(z.string().max(100)).max(2).optional(),
});

export const listingOutputSchema = z.object({
  title: z.string().min(3).max(140),
  short_description: z.string().max(200),
  description: z.string().min(40).max(2000),
  highlights: z.array(z.string().max(120)).min(3).max(5),
  tags: z.array(z.string().max(30)).min(5).max(10),
  care_instructions: z.string().max(500),
  seo_title: z.string().max(70),
  seo_description: z.string().max(160),
  suggested_price_inr: z.number().int().min(1).max(2500),
  price_rationale: z.string().max(300),
  affordability_warning: z.string().max(300),
});

export const reviewSummaryOutputSchema = z.object({
  overview: z.string().min(5).max(300),
  pros: z.array(z.string().max(80)).min(1).max(4),
  cons: z.array(z.string().max(80)).max(3),
  sentiment: z.enum(["positive", "mixed", "negative"]),
});

export type GiftAdvisorInput = z.infer<typeof giftAdvisorInputSchema>;
export type ProductQaInput = z.infer<typeof productQaInputSchema>;
export type ListingInput = z.infer<typeof listingInputSchema>;
export type GiftAdvisorOutput = z.infer<typeof giftAdvisorOutputSchema>;
export type ProductQaOutput = z.infer<typeof productQaOutputSchema>;
export type ListingOutput = z.infer<typeof listingOutputSchema>;
export type ReviewSummaryOutput = z.infer<typeof reviewSummaryOutputSchema>;
