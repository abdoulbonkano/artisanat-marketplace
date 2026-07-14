import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendeurDashboardPage() {
  const user = await requireSeller();

  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id },
    include: { _count: { select: { products: true } } },
  });

  const [ordersCount] = await Promise.all([
    shop
      ? prisma.orderItem.count({ where: { shopId: shop.id } })
      : Promise.resolve(0),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour, {shop?.name ?? user.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Boutique{" "}
          <Link href={`/boutiques/${shop?.slug}`} className="underline">
            /boutiques/{shop?.slug}
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {shop?._count.products ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Articles commandes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
