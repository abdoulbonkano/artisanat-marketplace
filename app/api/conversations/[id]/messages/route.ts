import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { shop: true },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isBuyer = conversation.buyerId === session.user.id;
  const isSeller = conversation.shop.ownerId === session.user.id;
  if (!isBuyer && !isSeller) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const after = searchParams.get("after");
  const afterDate = after ? new Date(after) : null;

  const messages = await prisma.message.findMany({
    where: {
      conversationId: id,
      ...(afterDate && !Number.isNaN(afterDate.getTime())
        ? { createdAt: { gt: afterDate } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  return NextResponse.json({
    messages: messages.map((message) => ({
      id: message.id,
      body: message.body,
      senderId: message.senderId,
      senderName: message.sender.name,
      createdAt: message.createdAt.toISOString(),
    })),
  });
}
