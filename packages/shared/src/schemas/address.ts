import { z } from "zod";

export const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().trim().min(3, "Address line 1 must be at least 3 characters").max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(80),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(80),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
