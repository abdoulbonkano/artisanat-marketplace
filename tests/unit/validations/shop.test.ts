import { describe, expect, it } from "vitest";
import { createShopSchema } from "@/lib/validations/shop";

const validShop = {
  name: "Bijoux du Niger",
  description: "Bijoux artisanaux en bronze et en argent, faconnes a la main a Niamey.",
  siret: "12345678901234",
  phone: "0612345678",
};

describe("createShopSchema", () => {
  it("accepts a valid shop", () => {
    const result = createShopSchema.safeParse(validShop);
    expect(result.success).toBe(true);
  });

  it("rejects a SIRET with the wrong number of digits", () => {
    const result = createShopSchema.safeParse({ ...validShop, siret: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects a SIRET containing letters", () => {
    const result = createShopSchema.safeParse({
      ...validShop,
      siret: "1234567890123A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description shorter than 20 characters", () => {
    const result = createShopSchema.safeParse({
      ...validShop,
      description: "Trop court",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number shorter than 6 characters", () => {
    const result = createShopSchema.safeParse({ ...validShop, phone: "123" });
    expect(result.success).toBe(false);
  });
});
