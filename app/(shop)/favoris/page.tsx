import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Mes favoris",
};

export const dynamic = "force-dynamic";

export default async function FavorisPage() {
  const user = await requireUser();

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: { shop: true, images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = wishlist
    .map((w: (typeof wishlist)[number]) => w.product)
    .filter(
      (p: (typeof wishlist)[number]["product"]) =>
        p.status === "PUBLISHED" && p.shop.status === "ACTIVE",
    );

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mes favoris</h1>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucun favori pour le moment"
          description="Cliquez sur le coeur d'un produit pour le retrouver ici."
          action={
            <Button render={<Link href="/produits" />} nativeButton={false} size="sm">
              Decouvrir les creations
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: (typeof products)[number]) => (
            <ProductCard key={product.id} product={product} wishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
