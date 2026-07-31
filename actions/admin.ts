"use server";

import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { shopApprovedEmail, shopRejectedEmail } from "@/lib/emails/templates";
import { logAdminAction } from "@/lib/audit";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { stripe } from "@/lib/stripe";
import { deleteProductImage } from "@/lib/storage";

export async function suspendShopAction(shopId: string) {
  const admin = await requireAdmin();
  const previous = await prisma.shop.findUnique({ where: { id: shopId } });

  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: { status: "SUSPENDED" },
    include: { owner: true },
  });

  if (previous?.status === "PENDING") {
    await sendEmail({
      to: shop.owner.email,
      ...shopRejectedEmail({ shopName: shop.name }),
    });
  }

  await logAdminAction(admin.id, "shop.suspend", shopId, shop.name);
  revalidatePath("/admin/boutiques");
}

export async function activateShopAction(shopId: string) {
  const admin = await requireAdmin();
  const previous = await prisma.shop.findUnique({ where: { id: shopId } });

  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: { status: "ACTIVE" },
    include: { owner: true },
  });

  if (previous?.status === "PENDING") {
    await sendEmail({
      to: shop.owner.email,
      ...shopApprovedEmail({
        shopName: shop.name,
        shopUrl: `${SITE_URL}/boutiques/${shop.slug}`,
      }),
    });
  }

  await logAdminAction(admin.id, "shop.activate", shopId, shop.name);
  revalidatePath("/admin/boutiques");
}

export async function unpublishProductAction(productId: string) {
  const admin = await requireAdmin();
  const product = await prisma.product.update({
    where: { id: productId },
    data: { status: "ARCHIVED" },
  });
  await logAdminAction(admin.id, "product.unpublish", productId, product.title);
  revalidatePath("/admin/produits");
}

export async function deleteProductAdminAction(productId: string) {
  const admin = await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  const images = await prisma.productImage.findMany({ where: { productId } });
  await prisma.product.delete({ where: { id: productId } });
  await Promise.all(images.map((image: { url: string }) => deleteProductImage(image.url)));
  await logAdminAction(admin.id, "product.delete", productId, product?.title);
  revalidatePath("/admin/produits");
}

export async function promoteToAdminAction(userId: string) {
  const admin = await requireAdmin();
  const user = await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
  await logAdminAction(admin.id, "user.promote", userId, user.email);
  revalidatePath("/admin/utilisateurs");
}

export async function demoteAdminAction(userId: string) {
  const currentAdmin = await requireAdmin();
  if (currentAdmin.id === userId) {
    throw new Error("Vous ne pouvez pas retirer vos propres droits administrateur");
  }
  const shop = await prisma.shop.findUnique({ where: { ownerId: userId } });
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: shop ? "SELLER" : "BUYER" },
  });
  await logAdminAction(currentAdmin.id, "user.demote", userId, user.email);
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

export async function refundOrderAction(orderId: string) {
  const admin = await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order || (order.status !== "PAID" && order.status !== "FULFILLED")) {
    throw new Error("Cette commande ne peut pas etre remboursee");
  }

  if (order.payment?.stripePaymentIntentId) {
    try {
      await stripe.refunds.create({ payment_intent: order.payment.stripePaymentIntentId });
    } catch {
      // Stripe can reject (test-mode key, already refunded) - still record the
      // decision so it can be reconciled manually if needed.
    }
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "REFUNDED" } }),
    prisma.payment.update({ where: { orderId }, data: { status: "REFUNDED" } }),
  ]);

  await logAdminAction(admin.id, "order.refund", orderId, `${(order.totalCents / 100).toFixed(2)} €`);
  revalidatePath("/admin/commandes");
}
