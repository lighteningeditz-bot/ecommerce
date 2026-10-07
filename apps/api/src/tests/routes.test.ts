import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { productUpsertSchema, addressSchema, MAX_LISTING_PRICE_INR } from "@kalakart/shared";

const app = createApp();

describe("Backend Routes & Validation", () => {
  it("GET /api/health returns 200 and healthy status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data.service).toBe("kalakart-api");
    expect(res.body.error).toBeNull();
  });

  it("GET /api/settings returns public store configuration", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(200);
    expect(res.body.data.max_listing_price_inr).toBe(MAX_LISTING_PRICE_INR);
    expect(res.body.data.free_shipping_threshold).toBe(499);
    expect(res.body.error).toBeNull();
  });

  it("GET /api/cart without Authorization header returns 401 UNAUTHORIZED", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/admin/products without token returns 401 UNAUTHORIZED", async () => {
    const res = await request(app).get("/api/admin/products");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("Hard Affordability Rule: rejects product creation above ₹2,500 via schema", () => {
    const invalidProduct = {
      category_id: "c1000000-0000-0000-0000-000000000001",
      title: "Extravagant Silver Vase",
      description: "A luxury vase handmade with silver plating and precious stones.",
      price_inr: 3500, // Violates max limit 2500
      stock_qty: 5,
    };

    const parsed = productUpsertSchema.safeParse(invalidProduct);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("2,500");
    }
  });

  it("Address validation strictly checks Indian phone number and 6-digit pincode", () => {
    const badAddress = {
      full_name: "Rahul",
      phone: "12345", // Invalid (must be 10 digits starting with 6-9)
      line1: "123 Street",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "123", // Invalid (must be 6 digits)
    };

    const parsed = addressSchema.safeParse(badAddress);
    expect(parsed.success).toBe(false);
  });
});
