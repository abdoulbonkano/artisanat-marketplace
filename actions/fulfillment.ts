"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireShop, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { markShipmentSchema, requestReturnSchema } from "@/lib/validations/fulfillment";

export type MarkShipmentState = { error?: string; success?: boolean } | undefined;

export async function markShipmentShippedAction(
  _prevState: MarkShipmentState,
  formData: FormData,
): Promise<MarkShipmentState> {
  const { shop } = await requireShop();

  const parsed = markShipmentSchema.safeParse({
    orderId: formData.get("orderId"),
    carrier: formData.get("carrier"),
    trackingNumber: formData.get("trackingNumber"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { items: true },
  });

  if (!order || !order.items.some((item: (typeof order.items)[number]) => item.shopId === shop.id)) {
    return { error: "Commande introuvable" };
  }

  await prisma.shipment.upsert({
    where: { orderId_shopId: { orderId: order.id, shopId: shop.id } },
    update: {
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
      shippedAt: new Date(),
    },
    create: {
      orderId: order.id,
      shopId: shop.id,
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
      shippedAt: new Date(),
    },
  });

  // Multi-shop orders only flip to FULFILLED once every seller involved has shipped.
  const shopIds = [...new Set(order.items.map((item: (typeof order.items)[number]) => item.shopId))];
  const shipments = await prisma.shipment.findMany({
    where: { orderId: order.id, shopId: { in: shopIds } },
  });
  const allShipped = shopIds.every((id) =>
    shipments.some((s: (typeof shipments)[number]) => s.shopId === id && s.shippedAt),
  );
  if (allShipped && order.status === "PAID") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FULFILLED" } });
  }

  revalidatePath("/vendeur/commandes");
  revalidatePath(`/commandes/${order.id}`);
  return { success: true };
}

export type RequestReturnState = { error?: string; success?: boolean } | undefined;

export async function requestReturnAction(
  _prevState: RequestReturnState,
  formData: FormData,
): Promise<RequestReturnState> {
  const user = await requireUser();

  const parsed = requestReturnSchema.safeParse({
    orderItemId: formData.get("orderItemId"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: parsed.data.orderItemId },
    include: { order: true },
  });

  if (!orderItem || orderItem.order.buyerId !== user.id) {
    return { error: "Article introuvable" };
  }

  if (orderItem.order.status !== "PAID" && orderItem.order.status !== "FULFILLED") {
    return { error: "Retour impossible pour cette commande" };
  }

  try {
    await prisma.returnRequest.create({
      data: { orderItemId: orderItem.id, reason: parsed.data.reason },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Une demande de retour existe deja pour cet article" };
    }
    throw error;
  }

  revalidatePath(`/commandes/${orderItem.orderId}`);
  return { success: true };
}

export async function approveReturnAction(returnRequestId: string) {
  const { shop } = await requireShop();

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnRequestId },
    include: { orderItem: { include: { order: { include: { payment: true } } } } },
  });

  if (!returnRequest || returnRequest.orderItem.shopId !== shop.id) {
    throw new Error("Demande introuvable");
  }

  const paymentIntentId = returnRequest.orderItem.order.payment?.stripePaymentIntentId;
  const refundAmount =
    returnRequest.orderItem.priceCentsSnapshot * returnRequest.orderItem.quantity;

  if (paymentIntentId) {
    try {
      await stripe.refunds.create({ payment_intent: paymentIntentId, amount: refundAmount });
    } catch {
      // Stripe can reject (test-mode key, already refunded, etc.) - the
      // seller's decision is still recorded and can be reconciled manually.
    }
  }

  await prisma.returnRequest.update({
    where: { id: returnRequestId },
    data: { status: "REFUNDED" },
  });

  revalidatePath("/vendeur/commandes");
}

export async function rejectReturnAction(returnRequestId: string) {
  const { shop } = await requireShop();

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnRequestId },
    include: { orderItem: true },
  });

  if (!returnRequest || returnRequest.orderItem.shopId !== shop.id) {
    throw new Error("Demande introuvable");
  }

  await prisma.returnRequest.update({
    where: { id: returnRequestId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/vendeur/commandes");
}
