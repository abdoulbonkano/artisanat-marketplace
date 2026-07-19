import { notFound } from "next/navigation";
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

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.buyerId !== user.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Commande du {order.createdAt.toLocaleDateString("fr-FR")}
        </h1>
        <Badge variant="secondary">{statusLabel[order.status]}</Badge>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">Livraison</h2>
        <p className="text-sm text-muted-foreground">
          {order.shippingName}
          <br />
          {order.shippingAddress}
          <br />
          {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {order.items.map((item: (typeof order.items)[number]) => (
          <div key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>
              {item.titleSnapshot} x{item.quantity}
            </span>
            <span>
              {((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{(order.totalCents / 100).toFixed(2)} EUR</span>
      </div>
    </div>
  );
}
