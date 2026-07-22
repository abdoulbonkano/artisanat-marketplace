"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { shippingSchema } from "@/lib/validations/checkout";
import type { ActionState } from "@/actions/auth";

export async function createCheckoutSessionAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = shippingSchema.safeParse({
    shippingName: formData.get("shippingName"),
    shippingAddress: formData.get("shippingAddress"),
    shippingCity: formData.get("shippingCity"),
    shippingPostalCode: formData.get("shippingPostalCode"),
    shippingCountry: formData.get("shippingCountry") || "FR",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { shop: true } } } } },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Votre panier est vide" };
  }

  // Never trust client cart state at checkout time: re-check stock/price
  // against the database right before creating the order.
  for (const item of cart.items) {
    if (
      item.product.status !== "PUBLISHED" ||
      item.product.shop.status !== "ACTIVE" ||
      item.product.stock < item.quantity
    ) {
      return { error: `"${item.product.title}" n'est plus disponible` };
    }
  }

  const totalCents = cart.items.reduce(
    (sum: number, item: (typeof cart.items)[number]) =>
      sum + item.product.priceCents * item.quantity,
    0,
  );

  const rawPromoCode = String(formData.get("promoCode") ?? "").trim().toUpperCase();
  let promoCode = null;
  let discountCents = 0;

  if (rawPromoCode) {
    promoCode = await prisma.promoCode.findUnique({ where: { code: rawPromoCode } });
    const now = new Date();
    const valid =
      promoCode &&
      promoCode.active &&
      (!promoCode.expiresAt || promoCode.expiresAt > now) &&
      (!promoCode.maxUses || promoCode.usedCount < promoCode.maxUses);

    if (!valid) {
      return { error: "Code promo invalide ou expire" };
    }

    discountCents =
      promoCode!.type === "PERCENTAGE"
        ? Math.round((totalCents * promoCode!.value) / 100)
        : promoCode!.value;
    discountCents = Math.min(discountCents, totalCents);
  }

  const finalTotalCents = totalCents - discountCents;

  const order = await prisma.order.create({
    data: {
      buyerId: user.id,
      totalCents: finalTotalCents,
      discountCents,
      promoCodeId: promoCode?.id,
      shippingName: parsed.data.shippingName,
      shippingAddress: parsed.data.shippingAddress,
      shippingCity: parsed.data.shippingCity,
      shippingPostalCode: parsed.data.shippingPostalCode,
      shippingCountry: parsed.data.shippingCountry,
      items: {
        create: cart.items.map((item: (typeof cart.items)[number]) => ({
          productId: item.productId,
          shopId: item.product.shopId,
          titleSnapshot: item.product.title,
          priceCentsSnapshot: item.product.priceCents,
          quantity: item.quantity,
        })),
      },
      payment: {
        create: {
          amountCents: finalTotalCents,
          status: "REQUIRES_PAYMENT",
        },
      },
    },
  });

  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  let discounts: { coupon: string }[] | undefined;
  try {
    if (discountCents > 0) {
      const coupon = await stripe.coupons.create({
        duration: "once",
        amount_off: discountCents,
        currency: "eur",
      });
      discounts = [{ coupon: coupon.id }];
    }
  } catch {
    return { error: "Impossible d'appliquer le code promo pour le moment" };
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.items.map((item: (typeof cart.items)[number]) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.product.priceCents,
          product_data: { name: item.product.title },
        },
      })),
      discounts,
      metadata: { orderId: order.id },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });
  } catch {
    return {
      error:
        "Paiement indisponible pour le moment (configuration Stripe manquante).",
    };
  }

  if (!session.url) {
    return { error: "Impossible de creer la session de paiement" };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  redirect(session.url);
}
