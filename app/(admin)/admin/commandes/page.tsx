import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

export default async function AdminCommandesPage() {
  const [orders, paidItems] = await Promise.all([
    prisma.order.findMany({
      include: { buyer: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.orderItem.findMany({
      where: { order: { status: "PAID" } },
      select: { shopId: true, priceCentsSnapshot: true, quantity: true },
    }),
  ]);

  const owedByShop = new Map<string, { quantity: number; amountCents: number }>();
  for (const item of paidItems) {
    const current = owedByShop.get(item.shopId) ?? { quantity: 0, amountCents: 0 };
    current.quantity += item.quantity;
    current.amountCents += item.priceCentsSnapshot * item.quantity;
    owedByShop.set(item.shopId, current);
  }

  const shops = await prisma.shop.findMany({
    where: { id: { in: [...owedByShop.keys()] } },
  });
  const shopNameById = new Map(shops.map((shop) => [shop.id, shop.name]));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Toutes les commandes</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Acheteur</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.createdAt.toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{order.buyer.email}</TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>{(order.totalCents / 100).toFixed(2)} EUR</TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabel[order.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Montants dus par boutique
          </h2>
          <p className="text-sm text-muted-foreground">
            Base sur les commandes payees. Les reversements aux vendeurs se font
            manuellement pour le moment (pas de Stripe Connect en MVP).
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boutique</TableHead>
              <TableHead>Articles vendus</TableHead>
              <TableHead>Montant du</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...owedByShop.entries()].map(([shopId, totals]) => (
              <TableRow key={shopId}>
                <TableCell>{shopNameById.get(shopId) ?? shopId}</TableCell>
                <TableCell>{totals.quantity}</TableCell>
                <TableCell>{(totals.amountCents / 100).toFixed(2)} EUR</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
