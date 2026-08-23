import { describe, expect, it } from "vitest";
import * as OTPAuth from "otpauth";
import {
  generateRecoveryCodes,
  generateTotpSecret,
  getOtpAuthUri,
  verifyTotpCode,
} from "@/lib/two-factor";

function codeFor(secret: string) {
  return new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  }).generate();
}

describe("generateTotpSecret", () => {
  it("generates a base32 secret", () => {
    expect(generateTotpSecret()).toMatch(/^[A-Z2-7]+=*$/);
  });

  it("generates a different secret each time", () => {
    expect(generateTotpSecret()).not.toBe(generateTotpSecret());
  });
});

describe("getOtpAuthUri", () => {
  it("builds an otpauth:// URI containing the issuer and email", () => {
    const secret = generateTotpSecret();
    const uri = getOtpAuthUri(secret, "amina@example.com");
    expect(uri).toMatch(/^otpauth:\/\/totp\//);
    expect(uri).toContain(encodeURIComponent("amina@example.com"));
    expect(uri).toContain(encodeURIComponent("Façonné"));
  });
});

describe("verifyTotpCode", () => {
  it("accepts the current valid code", () => {
    const secret = generateTotpSecret();
    expect(verifyTotpCode(secret, codeFor(secret))).toBe(true);
  });

  it("rejects an incorrect code", () => {
    const secret = generateTotpSecret();
    expect(verifyTotpCode(secret, "000000")).toBe(false);
  });

  it("rejects a code generated with a different secret", () => {
    const secretA = generateTotpSecret();
    const secretB = generateTotpSecret();
    expect(verifyTotpCode(secretA, codeFor(secretB))).toBe(false);
  });
});

describe("generateRecoveryCodes", () => {
  it("generates 10 codes by default, each formatted as XXXXX-XXXXX", () => {
    const codes = generateRecoveryCodes();
    expect(codes).toHaveLength(10);
    for (const code of codes) {
      expect(code).toMatch(/^[0-9A-F]{5}-[0-9A-F]{5}$/);
    }
  });

  it("generates unique codes", () => {
    const codes = generateRecoveryCodes();
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("respects a custom count", () => {
    expect(generateRecoveryCodes(3)).toHaveLength(3);
  });
});
