import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DRAFT: "Brouillon",
  PUBLISHED: "Publie",
  ARCHIVED: "Archive",
};

export default async function VendeurProduitsPage() {
  const { shop } = await requireShop();
  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Mes produits</h1>
        <Button
          render={<Link href="/vendeur/produits/nouveau" />}
          nativeButton={false}
        >
          Nouveau produit
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas encore de produit.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: (typeof products)[number]) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    href={`/vendeur/produits/${product.id}`}
                    className="underline"
                  >
                    {product.title}
                  </Link>
                </TableCell>
                <TableCell>{(product.priceCents / 100).toFixed(2)} EUR</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabel[product.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
