"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { deleteProductImage, isAllowedImage, saveProductImage } from "@/lib/storage";
import { productSchema } from "@/lib/validations/product";
import type { ActionState } from "@/actions/auth";

async function ownedProductOrThrow(productId: string) {
  const { shop } = await requireShop();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.shopId !== shop.id) {
    throw new Error("Produit introuvable");
  }
  return product;
}

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
  const { shop } = await requireShop();

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
  const { shop } = await requireShop();

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
  await ownedProductOrThrow(productId);

  const images = await prisma.productImage.findMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });
  await Promise.all(images.map((image: { url: string }) => deleteProductImage(image.url)));

  revalidatePath("/vendeur/produits");
  redirect("/vendeur/produits");
}

export async function addProductImageAction(productId: string, formData: FormData) {
  await ownedProductOrThrow(productId);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return;
  }
  if (!isAllowedImage(file)) {
    throw new Error("Image invalide (JPEG/PNG/WebP, 5 Mo maximum)");
  }

  const url = await saveProductImage(file);
  const count = await prisma.productImage.count({ where: { productId } });

  await prisma.productImage.create({
    data: { productId, url, position: count },
  });

  revalidatePath(`/vendeur/produits/${productId}`);
}

export async function removeProductImageAction(productId: string, imageId: string) {
  await ownedProductOrThrow(productId);

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image || image.productId !== productId) {
    throw new Error("Image introuvable");
  }

  await prisma.productImage.delete({ where: { id: imageId } });
  await deleteProductImage(image.url);

  revalidatePath(`/vendeur/produits/${productId}`);
}
