"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function addToCartAction(productId: string, formData: FormData) {
  const user = await requireUser();
  const requestedQuantity = Math.max(1, Number(formData.get("quantity")) || 1);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "PUBLISHED") {
    throw new Error("Produit indisponible");
  }

  const cart = await getOrCreateCart(user.id);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const nextQuantity = Math.min(
    (existing?.quantity ?? 0) + requestedQuantity,
    product.stock,
  );

  if (nextQuantity <= 0) {
    revalidatePath("/panier");
    return;
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId, quantity: nextQuantity },
  });

  revalidatePath("/panier");
}

export async function updateCartItemAction(itemId: string, formData: FormData) {
  const user = await requireUser();
  const quantity = Math.max(0, Number(formData.get("quantity")) || 0);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true },
  });
  if (!item || item.cart.userId !== user.id) {
    throw new Error("Article introuvable");
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.min(quantity, item.product.stock) },
    });
  }

  revalidatePath("/panier");
}

export async function removeCartItemAction(itemId: string) {
  const user = await requireUser();
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });
  if (!item || item.cart.userId !== user.id) {
    throw new Error("Article introuvable");
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/panier");
}
