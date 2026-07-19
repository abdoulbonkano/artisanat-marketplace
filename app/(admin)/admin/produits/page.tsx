import { ProductModerationActions } from "@/components/admin/product-moderation-actions";
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
  DRAFT: "Brouillon",
  PUBLISHED: "Publie",
  ARCHIVED: "Archive",
};

export default async function AdminProduitsPage() {
  const products = await prisma.product.findMany({
    include: { shop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Produits</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Boutique</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: (typeof products)[number]) => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.shop.name}</TableCell>
              <TableCell>{(product.priceCents / 100).toFixed(2)} EUR</TableCell>
              <TableCell>
                <Badge variant="secondary">{statusLabel[product.status]}</Badge>
              </TableCell>
              <TableCell>
                <ProductModerationActions
                  productId={product.id}
                  status={product.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
