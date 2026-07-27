import { describe, expect, it } from "vitest";
import { createPromoCodeSchema } from "@/lib/validations/promo";

describe("createPromoCodeSchema", () => {
  it("uppercases and trims the code", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "  ete2026  ",
      type: "PERCENTAGE",
      value: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("ETE2026");
    }
  });

  it("rejects a code shorter than 3 characters", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "AB",
      type: "PERCENTAGE",
      value: "10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive value", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "PROMO",
      type: "FIXED",
      value: "0",
    });
    expect(result.success).toBe(false);
  });

  it("leaves maxUses and expiresAt undefined when blank", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "PROMO",
      type: "FIXED",
      value: "5",
      maxUses: "",
      expiresAt: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maxUses).toBeUndefined();
      expect(result.data.expiresAt).toBeUndefined();
    }
  });

  it("parses maxUses and expiresAt when provided", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "PROMO",
      type: "FIXED",
      value: "5",
      maxUses: "100",
      expiresAt: "2026-12-31",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maxUses).toBe(100);
      expect(result.data.expiresAt).toBeInstanceOf(Date);
    }
  });

  it("rejects an unknown promo type", () => {
    const result = createPromoCodeSchema.safeParse({
      code: "PROMO",
      type: "BOGO",
      value: "5",
    });
    expect(result.success).toBe(false);
  });
});
