import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/permissions";

const navItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/boutiques", label: "Boutiques" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Marketplace Artisanat - Admin
        </Link>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Deconnexion
          </Button>
        </form>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 border-r px-4 py-6">
          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
