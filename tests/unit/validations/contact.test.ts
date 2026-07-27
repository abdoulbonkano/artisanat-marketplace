import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validations/contact";

describe("contactSchema", () => {
  it("accepts a valid contact message", () => {
    const result = contactSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      subject: "COMMANDE",
      message: "Bonjour, j'ai une question sur ma commande.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      subject: "AUTRE",
      message: "Court",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid subject", () => {
    const result = contactSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      subject: "SPAM",
      message: "Bonjour, j'ai une question sur ma commande.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than 3000 characters", () => {
    const result = contactSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      subject: "AUTRE",
      message: "a".repeat(3001),
    });
    expect(result.success).toBe(false);
  });
});
