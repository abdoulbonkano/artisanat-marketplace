import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t px-6 py-6 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} BONKANO SOLUTIONS</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/mentions-legales" className="hover:underline">
            Mentions legales
          </Link>
          <Link href="/cgu" className="hover:underline">
            CGU
          </Link>
          <Link href="/cgv" className="hover:underline">
            CGV
          </Link>
        </nav>
      </div>
    </footer>
  );
}
