import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/site";

const navItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/boutiques", label: "Boutiques" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/avis", label: "Avis" },
  { href: "/admin/promos", label: "Codes promo" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/audit", label: "Journal d'activite" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const unreadContactCount = await prisma.contactMessage.count({
    where: { readAt: null },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-4 md:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="md:hidden">Admin</span>
          <span className="hidden md:inline">{SITE_NAME} - Admin</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hidden hover:underline sm:inline">
            Voir le site public
          </Link>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Deconnexion
            </Button>
          </form>
        </div>
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b border-sidebar-border bg-sidebar px-4 py-2 text-sm md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 whitespace-nowrap text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {item.label}
            {item.href === "/admin/contact" && unreadContactCount > 0 && (
              <Badge className="h-5 min-w-5 justify-center px-1">
                {unreadContactCount}
              </Badge>
            )}
          </Link>
        ))}
      </nav>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden w-56 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-6 md:block">
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {item.label}
                {item.href === "/admin/contact" && unreadContactCount > 0 && (
                  <Badge className="h-5 min-w-5 justify-center px-1">
                    {unreadContactCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}
