"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createPromoCodeSchema } from "@/lib/validations/promo";

export type CreatePromoCodeState = { error?: string } | undefined;

export async function createPromoCodeAction(
  _prevState: CreatePromoCodeState,
  formData: FormData,
): Promise<CreatePromoCodeState> {
  await requireAdmin();

  const parsed = createPromoCodeSchema.safeParse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    maxUses: formData.get("maxUses"),
    expiresAt: formData.get("expiresAt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  if (parsed.data.type === "PERCENTAGE" && parsed.data.value > 100) {
    return { error: "Un pourcentage ne peut pas depasser 100" };
  }

  // The admin form collects FIXED amounts in euros for readability; store
  // everything in cents to match priceCents/totalCents elsewhere.
  const value = parsed.data.type === "FIXED" ? parsed.data.value * 100 : parsed.data.value;

  try {
    await prisma.promoCode.create({
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value,
        maxUses: parsed.data.maxUses,
        expiresAt: parsed.data.expiresAt,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Ce code existe deja" };
    }
    throw error;
  }

  revalidatePath("/admin/promos");
}

export async function togglePromoCodeAction(promoCodeId: string) {
  await requireAdmin();
  const promo = await prisma.promoCode.findUnique({ where: { id: promoCodeId } });
  if (!promo) return;
  await prisma.promoCode.update({
    where: { id: promoCodeId },
    data: { active: !promo.active },
  });
  revalidatePath("/admin/promos");
}
