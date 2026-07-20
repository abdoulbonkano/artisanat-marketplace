import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  const cartAgg = user
    ? await prisma.cartItem.aggregate({
        where: { cart: { userId: user.id } },
        _sum: { quantity: true },
      })
    : null;
  const cartCount = cartAgg?._sum.quantity ?? 0;

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
    <header className="flex items-center justify-between border-b bg-background/95 px-6 py-4.5 backdrop-blur-sm">
      <Link
        href="/"
        className="font-heading text-xl font-medium tracking-tight"
      >
        Marketplace Artisanat
      </Link>
      <nav className="flex items-center gap-5 text-sm">
        <Link href="/produits" className="text-foreground/80 hover:text-foreground">
          Produits
        </Link>
        {user ? (
          <>
            {(user.role === "SELLER" || user.role === "ADMIN") && (
              <Link
                href="/vendeur"
                className="text-foreground/80 hover:text-foreground"
              >
                Mon espace vendeur
              </Link>
            )}
            {user.role === "BUYER" && (
              <Link
                href="/vendeur/onboarding"
                className="text-foreground/80 hover:text-foreground"
              >
                Devenir vendeur
              </Link>
            )}
            {user.role === "ADMIN" && (
              <Link href="/admin" className="text-foreground/80 hover:text-foreground">
                Admin
              </Link>
            )}
            <Link
              href="/messages"
              className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground"
            >
              Messages
              {unreadCount > 0 && (
                <Badge className="h-5 min-w-5 justify-center px-1">
                  {unreadCount}
                </Badge>
              )}
            </Link>
            <Link href="/commandes" className="text-foreground/80 hover:text-foreground">
              Mes commandes
            </Link>
            <Link
              href="/panier"
              className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground"
            >
              Panier
              {cartCount > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1">
                  {cartCount}
                </Badge>
              )}
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Deconnexion
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/auth/connexion"
              className="text-foreground/80 hover:text-foreground"
            >
              Connexion
            </Link>
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
