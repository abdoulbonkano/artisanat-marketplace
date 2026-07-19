import Link from "next/link";
import { ShopStatusActions } from "@/components/admin/shop-status-actions";
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
  PENDING: "En attente",
  ACTIVE: "Active",
  SUSPENDED: "Suspendue",
};

export default async function AdminBoutiquesPage() {
  const shops = await prisma.shop.findMany({
    include: { owner: true, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Boutiques</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Boutique</TableHead>
            <TableHead>Proprietaire</TableHead>
            <TableHead>Produits</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop: (typeof shops)[number]) => (
            <TableRow key={shop.id}>
              <TableCell>
                <Link href={`/boutiques/${shop.slug}`} className="underline">
                  {shop.name}
                </Link>
              </TableCell>
              <TableCell>{shop.owner.email}</TableCell>
              <TableCell>{shop._count.products}</TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel[shop.status]}</Badge>
              </TableCell>
              <TableCell>
                <ShopStatusActions shopId={shop.id} status={shop.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
