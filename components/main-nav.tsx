"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Boutique" },
  { href: "/artisans", label: "Artisans" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-11 flex-wrap items-center justify-center gap-x-7 border-t border-border/70 px-6 text-sm">
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 pt-3.5 pb-2.5 transition-colors",
              active
                ? "border-accent font-medium text-foreground"
                : "border-transparent text-foreground/65 hover:border-border hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
