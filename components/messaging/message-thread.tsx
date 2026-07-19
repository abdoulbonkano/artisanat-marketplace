"use client";

import { useEffect, useRef, useState } from "react";
import { sendMessageAction } from "@/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  body: string;
  senderId: string;
  senderName: string;
  createdAt: string;
};

export function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const lastCreatedAtRef = useRef<string | undefined>(
    initialMessages[initialMessages.length - 1]?.createdAt,
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const after = lastCreatedAtRef.current;
      const url = after
        ? `/api/conversations/${conversationId}/messages?after=${encodeURIComponent(after)}`
        : `/api/conversations/${conversationId}/messages`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const data: { messages: Message[] } = await res.json();
      if (data.messages.length > 0) {
        setMessages((prev) => [...prev, ...data.messages]);
        lastCreatedAtRef.current = data.messages[data.messages.length - 1].createdAt;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const boundSend = sendMessageAction.bind(null, conversationId);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex max-h-[60vh] flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.senderId === currentUserId
                ? "ml-auto max-w-sm rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "mr-auto max-w-sm rounded-lg bg-muted px-3 py-2 text-sm"
            }
          >
            {message.body}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        action={async (formData) => {
          await boundSend(formData);
        }}
        className="flex gap-2"
      >
        <Input name="body" placeholder="Votre message..." required autoComplete="off" />
        <Button type="submit">Envoyer</Button>
      </form>
    </div>
  );
}
