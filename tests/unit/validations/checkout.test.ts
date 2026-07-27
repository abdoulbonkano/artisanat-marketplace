import { describe, expect, it } from "vitest";
import { shippingSchema } from "@/lib/validations/checkout";

const validShipping = {
  shippingName: "Amina Souley",
  shippingAddress: "12 rue des Artisans",
  shippingCity: "Lyon",
  shippingPostalCode: "69000",
};

describe("shippingSchema", () => {
  it("accepts valid shipping details and defaults the country to FR", () => {
    const result = shippingSchema.safeParse(validShipping);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.shippingCountry).toBe("FR");
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = shippingSchema.safeParse({ ...validShipping, shippingName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an address shorter than 5 characters", () => {
    const result = shippingSchema.safeParse({ ...validShipping, shippingAddress: "12" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing postal code", () => {
    const result = shippingSchema.safeParse({ ...validShipping, shippingPostalCode: "" });
    expect(result.success).toBe(false);
  });
});
