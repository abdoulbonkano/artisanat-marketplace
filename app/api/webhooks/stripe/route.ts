import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function fulfillOrder(orderId: string, paymentIntentId: string | null) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  // Stripe can redeliver the same event more than once: bail out if this
  // order was already marked paid so stock isn't decremented twice.
  if (!order || order.status === "PAID") return;

  const productItems = order.items.filter(
    (item: (typeof order.items)[number]) => item.productId,
  );

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } }),
    prisma.payment.update({
      where: { orderId },
      data: {
        status: "SUCCEEDED",
        stripePaymentIntentId: paymentIntentId ?? undefined,
      },
    }),
    ...productItems.map((item: (typeof productItems)[number]) =>
      prisma.product.update({
        where: { id: item.productId as string },
        data: { stock: { decrement: item.quantity } },
      }),
    ),
    prisma.cartItem.deleteMany({
      where: {
        cart: { userId: order.buyerId },
        productId: {
          in: productItems.map(
            (item: (typeof productItems)[number]) => item.productId as string,
          ),
        },
      },
    }),
  ]);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await fulfillOrder(orderId, (session.payment_intent as string) ?? null);
    }
  }

  return NextResponse.json({ received: true });
}
