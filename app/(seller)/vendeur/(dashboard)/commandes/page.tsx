import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

export default async function VendeurCommandesPage() {
  const { shop } = await requireShop();

  const items = await prisma.orderItem.findMany({
    where: { shopId: shop.id },
    include: { order: { include: { buyer: true } } },
    orderBy: { order: { createdAt: "desc" } },
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Commandes</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Aucune commande pour le moment"
          description="Vos ventes apparaitront ici des qu'un acheteur passera commande."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Acheteur</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Quantite</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: (typeof items)[number]) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.order.createdAt.toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>{item.order.buyer.name}</TableCell>
                <TableCell>{item.titleSnapshot}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabel[item.order.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
