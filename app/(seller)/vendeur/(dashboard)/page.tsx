import Link from "next/link";
import { Clock, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendeurDashboardPage() {
  const user = await requireSeller();

  const shop = await prisma.shop.findUnique({
    where: { ownerId: user.id },
    include: { _count: { select: { products: true } } },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [ordersCount, recentItems, topProducts] = await Promise.all([
    shop ? prisma.orderItem.count({ where: { shopId: shop.id } }) : Promise.resolve(0),
    shop
      ? prisma.orderItem.findMany({
          where: {
            shopId: shop.id,
            order: { status: { in: ["PAID", "FULFILLED"] }, createdAt: { gte: thirtyDaysAgo } },
          },
          select: { priceCentsSnapshot: true, quantity: true },
        })
      : Promise.resolve([]),
    shop
      ? prisma.orderItem.groupBy({
          by: ["productId", "titleSnapshot"],
          where: { shopId: shop.id, order: { status: { in: ["PAID", "FULFILLED"] } } },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  const revenue30dCents = recentItems.reduce(
    (sum: number, item: (typeof recentItems)[number]) => sum + item.priceCentsSnapshot * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour, {shop?.name ?? user.name}
        </h1>
        {shop?.status === "ACTIVE" ? (
          <p className="text-sm text-muted-foreground">
            Boutique{" "}
            <Link href={`/boutiques/${shop.slug}`} className="underline">
              /boutiques/{shop.slug}
            </Link>
          </p>
        ) : null}
      </div>

      {shop?.status === "PENDING" && (
        <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/8 px-4 py-3 text-sm">
          <Clock className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} />
          <div>
            <p className="font-medium">Boutique en attente de validation</p>
            <p className="text-muted-foreground">
              Votre demande est en cours d&apos;examen. Votre boutique et vos
              produits ne seront visibles publiquement qu&apos;apres
              approbation. Vous pouvez preparer votre catalogue des maintenant.
            </p>
          </div>
        </div>
      )}

      {shop?.status === "SUSPENDED" && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
          <div>
            <p className="font-medium">Boutique suspendue</p>
            <p className="text-muted-foreground">
              Votre boutique n&apos;est plus visible publiquement. Contactez-nous
              si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenus (30 jours)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {(revenue30dCents / 100).toFixed(2)} &euro;
          </CardContent>
        </Card>
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

      {topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {topProducts.map((product: (typeof topProducts)[number]) => (
                <div key={product.productId} className="flex justify-between text-sm">
                  <span>{product.titleSnapshot}</span>
                  <span className="text-muted-foreground">
                    {product._sum.quantity} vendu{(product._sum.quantity ?? 0) > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
