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
  await Promise.all(images.map((image: { url: string }) => deleteProductImage(image.url)));
  revalidatePath("/admin/produits");
}

export async function promoteToAdminAction(userId: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
  revalidatePath("/admin/utilisateurs");
}

export async function demoteAdminAction(userId: string) {
  const currentAdmin = await requireAdmin();
  if (currentAdmin.id === userId) {
    throw new Error("Vous ne pouvez pas retirer vos propres droits administrateur");
  }
  const shop = await prisma.shop.findUnique({ where: { ownerId: userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { role: shop ? "SELLER" : "BUYER" },
  });
  revalidatePath("/admin/utilisateurs");
}

export async function markContactMessageReadAction(messageId: string) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  });
  revalidatePath("/admin/contact");
}
