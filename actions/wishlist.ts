"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function toggleWishlistAction(productId: string) {
  const user = await requireUser();

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlist.create({ data: { userId: user.id, productId } });
  }

  revalidatePath("/favoris");
  revalidatePath("/produits");
}
