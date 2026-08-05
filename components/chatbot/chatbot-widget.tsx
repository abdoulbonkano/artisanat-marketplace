"use client";

import { useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE =
  "Bonjour ! Je peux repondre a vos questions sur la livraison, les retours, le paiement ou devenir vendeur. Pour tout ce qui touche a une commande precise, passez par \"Mes commandes\" ou le formulaire de contact.";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsStreaming(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Une erreur est survenue.");
        setIsStreaming(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
        scrollToBottom();
      }
    } catch {
      setError("Connexion impossible. Reessayez plus tard.");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div className="flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_16px_-6px_rgba(36,28,16,0.1),0_24px_48px_-16px_rgba(36,28,16,0.22)]">
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <p className="text-sm font-medium">Besoin d&apos;aide ?</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
              className="rounded-md p-1 hover:bg-primary-foreground/10"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              <ChatBubble role="assistant" content={WELCOME_MESSAGE} />
              {messages
                .filter((m) => m.content !== "")
                .map((m, i) => (
                  <ChatBubble key={i} role={m.role} content={m.content} />
                ))}
              {isStreaming && messages[messages.length - 1]?.content === "" && (
                <ChatBubble role="assistant" content="..." />
              )}
              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              disabled={isStreaming}
              aria-label="Votre message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming || !input.trim()}
              aria-label="Envoyer"
            >
              <Send className="size-4" strokeWidth={1.75} />
            </Button>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon-lg"
        className="size-14 rounded-full shadow-[0_8px_16px_-6px_rgba(36,28,16,0.18)]"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        aria-expanded={open}
      >
        {open ? <X className="size-6" strokeWidth={1.75} /> : <MessageCircle className="size-6" strokeWidth={1.75} />}
      </Button>
    </div>
  );
}

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "self-end bg-primary text-primary-foreground"
          : "self-start bg-secondary text-secondary-foreground"
      }`}
    >
      {content}
    </div>
  );
}
