import { NextResponse } from "next/server";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

function csvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const { shop } = await requireShop();

  const items = await prisma.orderItem.findMany({
    where: { shopId: shop.id },
    include: { order: { include: { buyer: true } } },
    orderBy: { order: { createdAt: "desc" } },
  });

  const header = [
    "Date",
    "Commande",
    "Acheteur",
    "Produit",
    "Quantite",
    "Prix unitaire (EUR)",
    "Total (EUR)",
    "Statut",
  ];

  const rows = items.map((item: (typeof items)[number]) => [
    item.order.createdAt.toISOString().slice(0, 10),
    item.orderId,
    item.order.buyer.name,
    item.titleSnapshot,
    String(item.quantity),
    (item.priceCentsSnapshot / 100).toFixed(2),
    ((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2),
    statusLabel[item.order.status] ?? item.order.status,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvField).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="commandes-${shop.slug}.csv"`,
    },
  });
}
