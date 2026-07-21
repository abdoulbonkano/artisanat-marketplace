import { Inbox } from "lucide-react";
import { markContactMessageReadAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

const subjectLabel: Record<string, string> = {
  COMMANDE: "Commande",
  BOUTIQUE: "Boutique / vendeur",
  PARTENARIAT: "Partenariat artisan",
  AUTRE: "Autre",
};

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Messages de contact</h1>

      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucun message pour le moment"
          description="Les messages envoyes depuis la page Contact du site apparaitront ici."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message: (typeof messages)[number]) => (
            <div
              key={message.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                  >
                    {message.email}
                  </a>
                  <Badge variant="secondary">{subjectLabel[message.subject]}</Badge>
                  {!message.readAt && <Badge>Non lu</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {message.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                  {!message.readAt && (
                    <form action={markContactMessageReadAction.bind(null, message.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        Marquer comme lu
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
