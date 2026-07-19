import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  const cartCount = user
    ? await prisma.cartItem
        .aggregate({
          where: { cart: { userId: user.id } },
          _sum: { quantity: true },
        })
        .then((result) => result._sum.quantity ?? 0)
    : 0;

  const unreadCount = user
    ? await prisma.message.count({
        where: {
          readAt: null,
          senderId: { not: user.id },
          conversation: {
            OR: [{ buyerId: user.id }, { shop: { ownerId: user.id } }],
          },
        },
      })
    : 0;

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
            <Link href="/messages">
              Messages{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link href="/commandes">Mes commandes</Link>
            <Link href="/panier">Panier{cartCount > 0 ? ` (${cartCount})` : ""}</Link>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Deconnexion
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/connexion">Connexion</Link>
            <Button
              render={<Link href="/auth/inscription" />}
              nativeButton={false}
              size="sm"
            >
              Inscription
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
