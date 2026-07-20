import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendeurMessagesPage() {
  const { user, shop } = await requireShop();

  const conversations = await prisma.conversation.findMany({
    where: { shopId: shop.id },
    include: {
      buyer: true,
      product: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: { where: { readAt: null, senderId: { not: user.id } } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas encore de conversation.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((conversation: (typeof conversations)[number]) => (
            <Link
              key={conversation.id}
              href={`/vendeur/messages/${conversation.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">
                  {conversation.buyer.name}
                  {conversation.product && ` - ${conversation.product.title}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {conversation.messages[0]?.body ?? "Aucun message"}
                </p>
              </div>
              {conversation._count.messages > 0 && (
                <Badge>{conversation._count.messages}</Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
