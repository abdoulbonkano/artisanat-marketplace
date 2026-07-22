import { LineChart } from "@/components/admin/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const DAYS = 30;

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildDaySeries(days: number): { key: string; label: string }[] {
  const series: { key: string; label: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    series.push({
      key: dayKey(d),
      label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    });
  }
  return series;
}

export default async function AdminDashboardPage() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const [userCount, shopCount, productCount, orderCount, paidTotal, recentOrders, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
      prisma.order.findMany({
        where: { status: { in: ["PAID", "FULFILLED"] }, createdAt: { gte: since } },
        select: { createdAt: true, totalCents: true },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
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

  const days = buildDaySeries(DAYS);

  const revenueByDay = new Map<string, number>();
  for (const order of recentOrders) {
    const key = dayKey(order.createdAt);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.totalCents);
  }
  const revenueSeries = days.map((d) => ({
    label: d.label,
    value: (revenueByDay.get(d.key) ?? 0) / 100,
  }));

  const signupsByDay = new Map<string, number>();
  for (const user of recentUsers) {
    const key = dayKey(user.createdAt);
    signupsByDay.set(key, (signupsByDay.get(key) ?? 0) + 1);
  }
  const signupsSeries = days.map((d) => ({
    label: d.label,
    value: signupsByDay.get(d.key) ?? 0,
  }));

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d&apos;affaires (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={revenueSeries}
              colorClass="chart-1"
              valueFormatter={(v) => `${v.toFixed(2)} EUR`}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inscriptions (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={signupsSeries}
              colorClass="chart-2"
              valueFormatter={(v) => `${v} inscription${v > 1 ? "s" : ""}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
