import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import * as OTPAuth from "otpauth";
import { prisma } from "@/lib/prisma";

const ISSUER = "Marketplace Artisanat";

function buildTotp(secret: string, label = "compte") {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

export function generateTotpSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function getOtpAuthUri(secret: string, email: string): string {
  return buildTotp(secret, email).toString();
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const delta = buildTotp(secret).validate({ token: code, window: 1 });
  return delta !== null;
}

function formatRecoveryCode(raw: string): string {
  return `${raw.slice(0, 5)}-${raw.slice(5, 10)}`.toUpperCase();
}

export function generateRecoveryCodes(count = 10): string[] {
  return Array.from({ length: count }, () => formatRecoveryCode(randomBytes(5).toString("hex")));
}

export function hashRecoveryCode(code: string): Promise<string> {
  return bcrypt.hash(code.toUpperCase(), 10);
}

export async function consumeRecoveryCodeIfValid(userId: string, code: string): Promise<boolean> {
  const candidates = await prisma.twoFactorRecoveryCode.findMany({
    where: { userId, usedAt: null },
  });

  for (const candidate of candidates) {
    if (await bcrypt.compare(code.toUpperCase(), candidate.codeHash)) {
      await prisma.twoFactorRecoveryCode.update({
        where: { id: candidate.id },
        data: { usedAt: new Date() },
      });
      return true;
    }
  }

  return false;
}
