import { z } from "zod";

export const inrInt = (min: number, max: number) => z.coerce.number().int().min(min).max(max);
export const cleanText = (max: number) =>
  z.string().trim().max(max).transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, ""));

export const uuid = z.string().uuid();

export const productListQuerySchema = z
  .object({
    q: cleanText(100).optional(),
    category: z.string().regex(/^[a-z0-9-]+$/).optional(),
    band: z.enum(["under-99", "under-199", "under-499", "under-999", "under-2500"]).optional(),
    minPrice: inrInt(0, 2500).optional(),
    maxPrice: inrInt(0, 2500).optional(),
    sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(48).default(12),
  })
  .refine((v) => v.minPrice == null || v.maxPrice == null || v.minPrice <= v.maxPrice, {
    message: "minPrice must be <= maxPrice",
    path: ["minPrice"],
  });

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
