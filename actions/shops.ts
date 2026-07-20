"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSeller, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { createShopSchema, updateShopSchema } from "@/lib/validations/shop";
import type { ActionState } from "@/actions/auth";

async function uniqueShopSlug(name: string) {
  const base = slugify(name) || "boutique";
  let slug = base;
  let attempt = 0;
  while (await prisma.shop.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
  return slug;
}

export async function createShopAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const existingShop = await prisma.shop.findUnique({ where: { ownerId: user.id } });
  if (existingShop) {
    redirect("/vendeur");
  }

  const parsed = createShopSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    siret: formData.get("siret"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const slug = await uniqueShopSlug(parsed.data.name);

  await prisma.$transaction([
    prisma.shop.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        siret: parsed.data.siret,
        phone: parsed.data.phone,
        slug,
        status: "PENDING",
        ownerId: user.id,
      },
    }),
    ...(user.role === "BUYER"
      ? [prisma.user.update({ where: { id: user.id }, data: { role: "SELLER" as const } })]
      : []),
  ]);

  redirect("/vendeur");
}

export async function updateShopAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireSeller();

  const parsed = updateShopSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    siret: formData.get("siret"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.shop.update({
    where: { ownerId: user.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      siret: parsed.data.siret,
      phone: parsed.data.phone,
    },
  });

  revalidatePath("/vendeur/boutique");
  return { error: undefined };
}
