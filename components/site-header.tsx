import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-semibold tracking-tight">
        Marketplace Artisanat
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/produits">Produits</Link>
        {user ? (
          <>
            {(user.role === "SELLER" || user.role === "ADMIN") && (
              <Link href="/vendeur">Mon espace vendeur</Link>
            )}
            {user.role === "BUYER" && (
              <Link href="/vendeur/onboarding">Devenir vendeur</Link>
            )}
            {user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
            <Link href="/messages">Messages</Link>
            <Link href="/panier">Panier</Link>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Deconnexion
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/connexion">Connexion</Link>
            <Button render={<Link href="/auth/inscription" />} size="sm">
              Inscription
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
