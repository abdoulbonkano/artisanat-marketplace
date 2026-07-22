import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const navItems = [
  { href: "/vendeur", label: "Tableau de bord" },
  { href: "/vendeur/produits", label: "Produits" },
  { href: "/vendeur/commandes", label: "Commandes" },
  { href: "/vendeur/messages", label: "Messages" },
  { href: "/vendeur/boutique", label: "Ma boutique" },
];

export default async function VendeurDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSeller();

  const shop = await prisma.shop.findUnique({ where: { ownerId: user.id } });
  const newOrdersCount = shop
    ? await prisma.order.count({
        where: {
          status: "PAID",
          items: { some: { shopId: shop.id } },
          shipments: { none: { shopId: shop.id } },
        },
      })
    : 0;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="font-heading text-lg font-medium tracking-tight">
          Marketplace Artisanat
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="gap-1.5 border-accent/25 text-accent hover:bg-accent/5"
          >
            <ShoppingBag className="size-3.5" />
            Espace acheteur
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Deconnexion
            </Button>
          </form>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-6">
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {item.label}
                {item.href === "/vendeur/commandes" && newOrdersCount > 0 && (
                  <Badge className="h-5 min-w-5 justify-center px-1">{newOrdersCount}</Badge>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 px-6 py-6">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}
