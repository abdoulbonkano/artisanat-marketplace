import Link from "next/link";
import { requireSeller } from "@/lib/permissions";

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
  await requireSeller();

  return (
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
  );
}
