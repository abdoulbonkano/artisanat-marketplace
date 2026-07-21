"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validations/review";

export type CreateReviewState = { error?: string; success?: boolean } | undefined;

export async function createReviewAction(
  _prevState: CreateReviewState,
  formData: FormData,
): Promise<CreateReviewState> {
  const user = await requireUser();

  const parsed = createReviewSchema.safeParse({
    orderItemId: formData.get("orderItemId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: parsed.data.orderItemId },
    include: { order: true },
  });

  if (!orderItem || !orderItem.productId) {
    return { error: "Article introuvable" };
  }

  if (orderItem.order.buyerId !== user.id) {
    return { error: "Non autorise" };
  }

  if (orderItem.order.status !== "PAID" && orderItem.order.status !== "FULFILLED") {
    return { error: "Vous ne pouvez laisser un avis que sur une commande payee" };
  }

  try {
    await prisma.review.create({
      data: {
        productId: orderItem.productId,
        authorId: user.id,
        orderItemId: orderItem.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Vous avez deja laisse un avis pour cet article" };
    }
    throw error;
  }

  revalidatePath(`/commandes/${orderItem.orderId}`);
  return { success: true };
}

export async function hideReviewAction(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({ where: { id: reviewId }, data: { hiddenAt: new Date() } });
  revalidatePath("/admin/avis");
}

export async function unhideReviewAction(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({ where: { id: reviewId }, data: { hiddenAt: null } });
  revalidatePath("/admin/avis");
}
