import { z } from "zod";
import { uuid } from "./catalog";

export const productUpsertBaseSchema = z.object({
  category_id: uuid,
  title: z.string().trim().min(3).max(140),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
  short_description: z.string().trim().max(200).optional().nullable(),
  description: z.string().trim().min(20).max(4000),
  highlights: z.array(z.string().trim().min(2).max(120)).max(8).default([]),
  tags: z.array(z.string().trim().toLowerCase().min(2).max(30)).max(12).default([]),
  materials: z.string().trim().max(150).optional().nullable(),
  dimensions: z.string().trim().max(80).optional().nullable(),
  care_instructions: z.string().trim().max(500).optional().nullable(),
  maker_story: z.string().trim().max(600).optional().nullable(),
  price_inr: z.coerce.number().positive().max(2500, "Price cannot exceed affordability cap of ₹2,500"),
  compare_at_price_inr: z.coerce.number().positive().max(5000).optional().nullable(),
  stock_qty: z.coerce.number().int().min(0).max(100000),
  sku: z.string().trim().max(40).optional().nullable(),
  is_published: z.boolean().default(false),
  seo_title: z.string().trim().max(70).optional().nullable(),
  seo_description: z.string().trim().max(160).optional().nullable(),
});

export const productUpsertSchema = productUpsertBaseSchema.refine(
  (v) =>
    v.compare_at_price_inr == null ||
    v.compare_at_price_inr === 0 ||
    v.compare_at_price_inr > v.price_inr,
  {
    message: "Compare-at price must be greater than price",
    path: ["compare_at_price_inr"],
  }
);

export const categoryUpsertSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;
