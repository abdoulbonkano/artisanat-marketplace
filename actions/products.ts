"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/validations/product";
import type { ActionState } from "@/actions/auth";

async function uniqueProductSlug(title: string) {
  const base = slugify(title) || "produit";
  let slug = base;
  let attempt = 0;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
  return slug;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status"),
  });
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireSeller();
  const shop = await prisma.shop.findUniqueOrThrow({ where: { ownerId: user.id } });

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const slug = await uniqueProductSlug(parsed.data.title);

  const product = await prisma.product.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priceCents: Math.round(parsed.data.price * 100),
      stock: parsed.data.stock,
      status: parsed.data.status,
      categoryId: parsed.data.categoryId || null,
      slug,
      shopId: shop.id,
    },
  });

  redirect(`/vendeur/produits/${product.id}`);
}

export async function updateProductAction(
  productId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireSeller();
  const shop = await prisma.shop.findUniqueOrThrow({ where: { ownerId: user.id } });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.shopId !== shop.id) {
    return { error: "Produit introuvable" };
  }

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      priceCents: Math.round(parsed.data.price * 100),
      stock: parsed.data.stock,
      status: parsed.data.status,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath(`/vendeur/produits/${productId}`);
  revalidatePath("/vendeur/produits");
  return { error: undefined };
}

export async function deleteProductAction(productId: string) {
  const user = await requireSeller();
  const shop = await prisma.shop.findUniqueOrThrow({ where: { ownerId: user.id } });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.shopId !== shop.id) {
    throw new Error("Produit introuvable");
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/vendeur/produits");
  redirect("/vendeur/produits");
}
