"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { newMessageEmail } from "@/lib/emails/templates";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export async function startConversationAction(shopId: string, productId?: string) {
  const user = await requireUser();

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) {
    throw new Error("Boutique introuvable");
  }
  if (shop.ownerId === user.id) {
    throw new Error("Vous ne pouvez pas vous contacter vous-meme");
  }

  // The (buyerId, shopId, productId) unique constraint only applies to
  // non-null productId in Postgres, so a general "contact shop" thread
  // (no product) needs a manual find-or-create instead of upsert.
  const conversation = productId
    ? await prisma.conversation.upsert({
        where: {
          buyerId_shopId_productId: { buyerId: user.id, shopId, productId },
        },
        update: {},
        create: { buyerId: user.id, shopId, productId },
      })
    : ((await prisma.conversation.findFirst({
        where: { buyerId: user.id, shopId, productId: null },
      })) ??
      (await prisma.conversation.create({
        data: { buyerId: user.id, shopId },
      })));

  redirect(`/messages/${conversation.id}`);
}

export async function sendMessageAction(conversationId: string, formData: FormData) {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { shop: { include: { owner: true } }, buyer: true },
  });
  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  const isBuyer = conversation.buyerId === user.id;
  const isSeller = conversation.shop.ownerId === user.id;
  if (!isBuyer && !isSeller) {
    throw new Error("Non autorise");
  }

  await prisma.message.create({
    data: { conversationId, senderId: user.id, body },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  const recipient = isBuyer ? conversation.shop.owner : conversation.buyer;
  const recipientUrl = isBuyer
    ? `${SITE_URL}/vendeur/messages/${conversationId}`
    : `${SITE_URL}/messages/${conversationId}`;

  await sendEmail({
    to: recipient.email,
    ...newMessageEmail({
      recipientName: recipient.name,
      senderName: user.name ?? "Un utilisateur",
      body,
      url: recipientUrl,
    }),
  });

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath(`/vendeur/messages/${conversationId}`);
}

export async function markConversationReadAction(conversationId: string) {
  const user = await requireUser();
  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  });
}
