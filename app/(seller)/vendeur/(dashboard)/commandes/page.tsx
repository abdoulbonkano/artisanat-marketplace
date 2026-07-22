import Link from "next/link";
import { ClipboardList, Download } from "lucide-react";
import { approveReturnAction, rejectReturnAction } from "@/actions/fulfillment";
import { MarkShippedForm } from "@/components/seller/mark-shipped-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

const returnStatusLabel: Record<string, string> = {
  REQUESTED: "En attente",
  APPROVED: "Approuve",
  REJECTED: "Refuse",
  REFUNDED: "Rembourse",
};

export default async function VendeurCommandesPage() {
  const { shop } = await requireShop();

  const items = await prisma.orderItem.findMany({
    where: { shopId: shop.id },
    include: { order: { include: { buyer: true } }, returnRequest: true },
    orderBy: { order: { createdAt: "desc" } },
  });

  const orderIds = [...new Set(items.map((item: (typeof items)[number]) => item.orderId))];
  const shipments = await prisma.shipment.findMany({
    where: { orderId: { in: orderIds }, shopId: shop.id },
  });
  const shipmentByOrder = new Map(shipments.map((s: (typeof shipments)[number]) => [s.orderId, s]));

  const ordersMap = new Map<string, (typeof items)[number][]>();
  for (const item of items) {
    const current = ordersMap.get(item.orderId) ?? [];
    current.push(item);
    ordersMap.set(item.orderId, current);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Commandes</h1>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/vendeur/commandes/export" />}
          nativeButton={false}
        >
          <Download className="size-3.5" />
          Exporter en CSV
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Aucune commande pour le moment"
          description="Vos ventes apparaitront ici des qu'un acheteur passera commande."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {[...ordersMap.entries()].map(([orderId, orderItems]) => {
            const order = orderItems[0].order;
            const shipment = shipmentByOrder.get(orderId);
            const canShip = order.status === "PAID" || order.status === "FULFILLED";

            return (
              <div key={orderId} className="flex flex-col gap-3 rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      Commande du {order.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <Badge variant="secondary">{statusLabel[order.status]}</Badge>
                </div>

                <div className="flex flex-col gap-1">
                  {orderItems.map((item: (typeof orderItems)[number]) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.titleSnapshot} x{item.quantity}
                      </span>
                      <span>
                        {((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR
                      </span>
                    </div>
                  ))}
                </div>

                {canShip && (
                  <div className="border-t border-border pt-3">
                    {shipment?.shippedAt ? (
                      <p className="text-sm text-muted-foreground">
                        Expediee le {shipment.shippedAt.toLocaleDateString("fr-FR")} via{" "}
                        {shipment.carrier} - suivi {shipment.trackingNumber}
                      </p>
                    ) : (
                      <MarkShippedForm orderId={orderId} />
                    )}
                  </div>
                )}

                {orderItems
                  .filter((item: (typeof orderItems)[number]) => item.returnRequest)
                  .map((item: (typeof orderItems)[number]) => (
                    <div
                      key={item.returnRequest!.id}
                      className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          Demande de retour - {item.titleSnapshot}
                        </p>
                        <Badge
                          variant={item.returnRequest!.status === "REQUESTED" ? "default" : "secondary"}
                        >
                          {returnStatusLabel[item.returnRequest!.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.returnRequest!.reason}</p>
                      {item.returnRequest!.status === "REQUESTED" && (
                        <div className="flex gap-2">
                          <form action={approveReturnAction.bind(null, item.returnRequest!.id)}>
                            <Button type="submit" size="sm">
                              Approuver et rembourser
                            </Button>
                          </form>
                          <form action={rejectReturnAction.bind(null, item.returnRequest!.id)}>
                            <Button type="submit" size="sm" variant="outline">
                              Refuser
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
