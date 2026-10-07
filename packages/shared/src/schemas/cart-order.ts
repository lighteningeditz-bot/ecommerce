import { z } from "zod";
import { cleanText, uuid } from "./catalog";

export const cartItemSchema = z.object({
  quantity: z.number().int().min(1).max(20),
});

export const cartMergeSchema = z.object({
  items: z
    .array(
      z.object({
        productId: uuid,
        quantity: z.number().int().min(1).max(20),
      })
    )
    .max(50),
});

export const placeOrderSchema = z.object({
  addressId: uuid,
  note: cleanText(300).optional(),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["confirmed", "packed", "shipped", "delivered", "cancelled"]),
});

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: cleanText(100).optional(),
  body: cleanText(1000).optional(),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CartMergeInput = z.infer<typeof cartMergeSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
