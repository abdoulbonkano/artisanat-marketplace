import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="dark border-t border-border bg-background px-6 py-10 text-sm text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-lg font-medium">
              Marketplace Artisanat
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              L&apos;artisanat, sans intermediaire. Achetez en direct aupres
              de createurs independants.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
            <Link href="/produits" className="w-fit hover:text-foreground">
              Tous les produits
            </Link>
            <Link href="/vendeur/onboarding" className="w-fit hover:text-foreground">
              Devenir vendeur
            </Link>
          </nav>
          <nav className="flex flex-col gap-2 text-xs text-muted-foreground">
            <Link href="/mentions-legales" className="w-fit hover:text-foreground">
              Mentions legales
            </Link>
            <Link href="/cgu" className="w-fit hover:text-foreground">
              CGU
            </Link>
            <Link href="/cgv" className="w-fit hover:text-foreground">
              CGV
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BONKANO SOLUTIONS</p>
            <a
              href="mailto:bonkano.solutions@gmail.com"
              className="w-fit hover:text-foreground hover:underline"
            >
              bonkano.solutions@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
