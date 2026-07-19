import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [userCount, shopCount, productCount, orderCount, paidTotal] = await Promise.all([
    prisma.user.count(),
    prisma.shop.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
  ]);

  const stats = [
    { label: "Utilisateurs", value: userCount },
    { label: "Boutiques", value: shopCount },
    { label: "Produits", value: productCount },
    { label: "Commandes", value: orderCount },
    {
      label: "Chiffre d'affaires (commandes payees)",
      value: `${((paidTotal._sum.totalCents ?? 0) / 100).toFixed(2)} EUR`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat: (typeof stats)[number]) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
