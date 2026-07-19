import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

export default async function CommandesPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mes commandes</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas encore de commande.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order: (typeof orders)[number]) => (
            <Link
              key={order.id}
              href={`/commandes/${order.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">
                  Commande du {order.createdAt.toLocaleDateString("fr-FR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} article(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {(order.totalCents / 100).toFixed(2)} EUR
                </span>
                <Badge variant="secondary">{statusLabel[order.status]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
