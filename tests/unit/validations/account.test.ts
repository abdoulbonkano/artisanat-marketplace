import { describe, expect, it } from "vitest";
import { deleteAccountSchema } from "@/lib/validations/account";

describe("deleteAccountSchema", () => {
  it("accepts the exact confirmation phrase", () => {
    const result = deleteAccountSchema.safeParse({
      password: "mypassword",
      confirmation: "SUPPRIMER",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a lowercase confirmation phrase", () => {
    const result = deleteAccountSchema.safeParse({
      password: "mypassword",
      confirmation: "supprimer",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing password", () => {
    const result = deleteAccountSchema.safeParse({
      password: "",
      confirmation: "SUPPRIMER",
    });
    expect(result.success).toBe(false);
  });
});
