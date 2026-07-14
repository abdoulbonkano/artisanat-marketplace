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

  if (user.role === "SELLER" || user.role === "ADMIN") {
    redirect("/vendeur");
  }

  const parsed = createShopSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
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
        slug,
        status: "ACTIVE",
        ownerId: user.id,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    }),
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
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.shop.update({
    where: { ownerId: user.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  revalidatePath("/vendeur/boutique");
  return { error: undefined };
}
