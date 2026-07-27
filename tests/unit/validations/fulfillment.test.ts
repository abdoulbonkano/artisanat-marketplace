import { describe, expect, it } from "vitest";
import { markShipmentSchema, requestReturnSchema } from "@/lib/validations/fulfillment";

describe("markShipmentSchema", () => {
  it("accepts valid shipment details", () => {
    const result = markShipmentSchema.safeParse({
      orderId: "order_1",
      carrier: "Colissimo",
      trackingNumber: "6A12345678901",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty carrier", () => {
    const result = markShipmentSchema.safeParse({
      orderId: "order_1",
      carrier: "",
      trackingNumber: "6A12345678901",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty tracking number", () => {
    const result = markShipmentSchema.safeParse({
      orderId: "order_1",
      carrier: "Colissimo",
      trackingNumber: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("requestReturnSchema", () => {
  it("accepts a sufficiently detailed reason", () => {
    const result = requestReturnSchema.safeParse({
      orderItemId: "item_1",
      reason: "L'objet est arrive casse pendant le transport.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a reason shorter than 10 characters", () => {
    const result = requestReturnSchema.safeParse({
      orderItemId: "item_1",
      reason: "Casse",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a reason longer than 1000 characters", () => {
    const result = requestReturnSchema.safeParse({
      orderItemId: "item_1",
      reason: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});
