"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireShop, requireSeller, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { deleteShopImage, isAllowedImage, saveShopImage } from "@/lib/storage";
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
    shippingPrice: formData.get("shippingPrice") || undefined,
    shippingInfo: formData.get("shippingInfo") || undefined,
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
        shippingPriceCents:
          parsed.data.shippingPrice !== undefined
            ? Math.round(parsed.data.shippingPrice * 100)
            : null,
        shippingInfo: parsed.data.shippingInfo,
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
    shippingPrice: formData.get("shippingPrice") || undefined,
    shippingInfo: formData.get("shippingInfo") || undefined,
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
      shippingPriceCents:
        parsed.data.shippingPrice !== undefined
          ? Math.round(parsed.data.shippingPrice * 100)
          : null,
      shippingInfo: parsed.data.shippingInfo,
    },
  });

  revalidatePath("/vendeur/boutique");
  return { error: undefined };
}

async function updateShopImage(
  kind: "logo" | "banner",
  formData: FormData,
): Promise<ActionState> {
  const { shop } = await requireShop();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choisissez une image" };
  }
  if (!isAllowedImage(file)) {
    return { error: "Image invalide (JPEG, PNG ou WebP, 5 Mo max)" };
  }

  const existing = kind === "logo" ? shop.logoUrl : shop.bannerUrl;
  if (existing) {
    await deleteShopImage(existing);
  }

  const url = await saveShopImage(file, kind);
  await prisma.shop.update({
    where: { id: shop.id },
    data: kind === "logo" ? { logoUrl: url } : { bannerUrl: url },
  });

  revalidatePath("/vendeur/boutique");
  revalidatePath(`/boutiques/${shop.slug}`);
  return { error: undefined };
}

export async function updateShopLogoAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return updateShopImage("logo", formData);
}

export async function updateShopBannerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return updateShopImage("banner", formData);
}

async function removeShopImage(kind: "logo" | "banner") {
  const { shop } = await requireShop();
  const existing = kind === "logo" ? shop.logoUrl : shop.bannerUrl;

  if (existing) {
    await deleteShopImage(existing);
    await prisma.shop.update({
      where: { id: shop.id },
      data: kind === "logo" ? { logoUrl: null } : { bannerUrl: null },
    });
  }

  revalidatePath("/vendeur/boutique");
  revalidatePath(`/boutiques/${shop.slug}`);
}

export async function removeShopLogoAction() {
  return removeShopImage("logo");
}

export async function removeShopBannerAction() {
  return removeShopImage("banner");
}
