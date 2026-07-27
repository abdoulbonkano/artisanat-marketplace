import { describe, expect, it } from "vitest";
import {
  requestPasswordResetSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

describe("signUpSchema", () => {
  it("accepts a valid signup", () => {
    const result = signUpSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = signUpSchema.safeParse({
      name: "A",
      email: "amina@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "Amina",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({
      name: "Amina",
      email: "amina@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("accepts any non-empty password", () => {
    const result = signInSchema.safeParse({
      email: "amina@example.com",
      password: "x",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = signInSchema.safeParse({
      email: "amina@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("requestPasswordResetSchema", () => {
  it("rejects a malformed email", () => {
    const result = requestPasswordResetSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "newpassword1",
      confirmPassword: "newpassword1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "abc123",
      password: "newpassword1",
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
    }
  });
});
