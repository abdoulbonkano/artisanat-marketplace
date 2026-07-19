import { notFound } from "next/navigation";
import { markConversationReadAction } from "@/actions/messages";
import { MessageThread } from "@/components/messaging/message-thread";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendeurMessageThreadPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const user = await requireSeller();
  const shop = await prisma.shop.findUniqueOrThrow({ where: { ownerId: user.id } });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      buyer: true,
      product: true,
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!conversation || conversation.shopId !== shop.id) {
    notFound();
  }

  await markConversationReadAction(conversationId);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {conversation.buyer.name}
        </h1>
        {conversation.product && (
          <p className="text-sm text-muted-foreground">{conversation.product.title}</p>
        )}
      </div>
      <MessageThread
        conversationId={conversation.id}
        currentUserId={user.id}
        initialMessages={conversation.messages.map((message: (typeof conversation.messages)[number]) => ({
          id: message.id,
          body: message.body,
          senderId: message.senderId,
          senderName: message.sender.name,
          createdAt: message.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
