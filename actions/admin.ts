"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { deleteProductImage } from "@/lib/storage";

export async function suspendShopAction(shopId: string) {
  await requireAdmin();
  await prisma.shop.update({ where: { id: shopId }, data: { status: "SUSPENDED" } });
  revalidatePath("/admin/boutiques");
}

export async function activateShopAction(shopId: string) {
  await requireAdmin();
  await prisma.shop.update({ where: { id: shopId }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/boutiques");
}

export async function unpublishProductAction(productId: string) {
  await requireAdmin();
  await prisma.product.update({ where: { id: productId }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/produits");
}

export async function deleteProductAdminAction(productId: string) {
  await requireAdmin();
  const images = await prisma.productImage.findMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });
  await Promise.all(images.map((image) => deleteProductImage(image.url)));
  revalidatePath("/admin/produits");
}
