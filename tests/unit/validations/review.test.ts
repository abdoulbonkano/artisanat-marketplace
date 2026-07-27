import { describe, expect, it } from "vitest";
import { createReviewSchema } from "@/lib/validations/review";

describe("createReviewSchema", () => {
  it("accepts a valid review without a comment", () => {
    const result = createReviewSchema.safeParse({
      orderItemId: "item_1",
      rating: "5",
    });
    expect(result.success).toBe(true);
  });

  it("trims the comment and drops it when it becomes empty", () => {
    const result = createReviewSchema.safeParse({
      orderItemId: "item_1",
      rating: "4",
      comment: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment).toBeUndefined();
    }
  });

  it("rejects a rating of 0", () => {
    const result = createReviewSchema.safeParse({
      orderItemId: "item_1",
      rating: "0",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a rating above 5", () => {
    const result = createReviewSchema.safeParse({
      orderItemId: "item_1",
      rating: "6",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a comment longer than 2000 characters", () => {
    const result = createReviewSchema.safeParse({
      orderItemId: "item_1",
      rating: "5",
      comment: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
