import { describe, expect, it } from "vitest";
import { productSchema } from "@/lib/validations/product";

describe("productSchema", () => {
  it("accepts a valid product", () => {
    const result = productSchema.safeParse({
      title: "Bague en bronze",
      description: "Une bague artisanale gravee a la main.",
      price: "45.5",
      stock: "3",
      status: "PUBLISHED",
    });
    expect(result.success).toBe(true);
  });

  it("coerces price and stock strings to numbers", () => {
    const result = productSchema.safeParse({
      title: "Bague en bronze",
      description: "Une bague artisanale gravee a la main.",
      price: "45.5",
      stock: "3",
      status: "DRAFT",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(45.5);
      expect(result.data.stock).toBe(3);
    }
  });

  it("rejects a non-positive price", () => {
    const result = productSchema.safeParse({
      title: "Bague en bronze",
      description: "Une bague artisanale gravee a la main.",
      price: "0",
      stock: "3",
      status: "PUBLISHED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative stock", () => {
    const result = productSchema.safeParse({
      title: "Bague en bronze",
      description: "Une bague artisanale gravee a la main.",
      price: "10",
      stock: "-1",
      status: "PUBLISHED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = productSchema.safeParse({
      title: "Ba",
      description: "Une bague artisanale gravee a la main.",
      price: "10",
      stock: "1",
      status: "PUBLISHED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = productSchema.safeParse({
      title: "Bague en bronze",
      description: "Une bague artisanale gravee a la main.",
      price: "10",
      stock: "1",
      status: "ARCHIVED",
    });
    expect(result.success).toBe(false);
  });
});
