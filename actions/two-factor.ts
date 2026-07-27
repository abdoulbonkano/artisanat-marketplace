"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  generateRecoveryCodes,
  generateTotpSecret,
  getOtpAuthUri,
  hashRecoveryCode,
  verifyTotpCode,
} from "@/lib/two-factor";
import { confirmTwoFactorSchema, disableTwoFactorSchema } from "@/lib/validations/two-factor";

export async function startTwoFactorSetupAction(): Promise<{
  secret: string;
  qrCodeDataUrl: string;
}> {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });

  const secret = generateTotpSecret();
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });

  const qrCodeDataUrl = await QRCode.toDataURL(getOtpAuthUri(secret, user.email));

  return { secret, qrCodeDataUrl };
}

export type ConfirmTwoFactorState =
  | { error: string }
  | { success: true; recoveryCodes: string[] }
  | undefined;

export async function confirmTwoFactorSetupAction(
  _prevState: ConfirmTwoFactorState,
  formData: FormData,
): Promise<ConfirmTwoFactorState> {
  const sessionUser = await requireUser();

  const parsed = confirmTwoFactorSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Code invalide" };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  if (!user.twoFactorSecret) {
    return { error: "Aucune configuration en cours. Recommencez." };
  }

  if (!verifyTotpCode(user.twoFactorSecret, parsed.data.code)) {
    return { error: "Code invalide. Verifiez l'heure de votre appareil et reessayez." };
  }

  const recoveryCodes = generateRecoveryCodes();
  const hashedCodes = await Promise.all(recoveryCodes.map((code) => hashRecoveryCode(code)));

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } }),
    prisma.twoFactorRecoveryCode.deleteMany({ where: { userId: user.id } }),
    prisma.twoFactorRecoveryCode.createMany({
      data: hashedCodes.map((codeHash) => ({ userId: user.id, codeHash })),
    }),
  ]);

  revalidatePath("/compte");
  return { success: true, recoveryCodes };
}

export type DisableTwoFactorState = { error?: string } | undefined;

export async function disableTwoFactorAction(
  _prevState: DisableTwoFactorState,
  formData: FormData,
): Promise<DisableTwoFactorState> {
  const sessionUser = await requireUser();

  const parsed = disableTwoFactorSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Mot de passe requis" };
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  if (!user.hashedPassword || !(await bcrypt.compare(parsed.data.password, user.hashedPassword))) {
    return { error: "Mot de passe incorrect" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    }),
    prisma.twoFactorRecoveryCode.deleteMany({ where: { userId: user.id } }),
  ]);

  revalidatePath("/compte");
}
