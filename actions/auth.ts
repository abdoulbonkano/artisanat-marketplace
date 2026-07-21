"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail, welcomeEmail } from "@/lib/emails/templates";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import {
  requestPasswordResetSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

export type ActionState = { error?: string } | undefined;

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe deja avec cet email" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  await sendEmail({ to: email, ...welcomeEmail({ name }) });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect" };
    }
    throw error;
  }
}

export async function signOutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}

export type RequestResetState = { error?: string; success?: boolean } | undefined;

// Always returns success (even for unknown emails) so the response can't be
// used to enumerate which addresses have an account.
export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user?.hashedPassword) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    await sendEmail({
      to: user.email,
      ...passwordResetEmail({
        name: user.name,
        url: `${SITE_URL}/auth/reinitialiser-mot-de-passe?token=${token}`,
      }),
    });
  }

  return { success: true };
}

export type ResetPasswordState = { error?: string; success?: boolean } | undefined;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Ce lien de reinitialisation est invalide ou a expire" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}
