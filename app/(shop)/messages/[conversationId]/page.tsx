import { notFound } from "next/navigation";
import { markConversationReadAction } from "@/actions/messages";
import { MessageThread } from "@/components/messaging/message-thread";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const user = await requireUser();

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      shop: true,
      product: true,
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!conversation || conversation.buyerId !== user.id) {
    notFound();
  }

  await markConversationReadAction(conversationId);

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {conversation.shop.name}
        </h1>
        {conversation.product && (
          <p className="text-sm text-muted-foreground">{conversation.product.title}</p>
        )}
      </div>
      <MessageThread
        conversationId={conversation.id}
        currentUserId={user.id}
        initialMessages={conversation.messages.map((message) => ({
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
