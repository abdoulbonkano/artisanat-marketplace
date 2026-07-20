import Link from "next/link";
import {
  LogOut,
  MessageCircle,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainNav } from "@/components/main-nav";
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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-[0_1px_0_rgba(36,28,16,0.04)] backdrop-blur-md">
      <div className="flex items-center gap-4 px-6 py-3.5 sm:gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-xl font-medium tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" strokeWidth={1.75} />
          </span>
          <span className="hidden sm:inline">Marketplace Artisanat</span>
        </Link>

        <form
          action="/produits"
          method="get"
          className="relative hidden max-w-md flex-1 sm:block"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Rechercher un bijou, une ceramique..."
            className="h-9 rounded-full pl-9"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {user ? (
            <>
              {(user.role === "SELLER" || user.role === "ADMIN") && (
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/vendeur" />}
                  nativeButton={false}
                  className="hidden md:inline-flex"
                >
                  Mon espace vendeur
                </Button>
              )}
              {user.role === "BUYER" && (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/vendeur/onboarding" />}
                  nativeButton={false}
                  className="hidden md:inline-flex"
                >
                  Devenir vendeur
                </Button>
              )}
              {user.role === "ADMIN" && (
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/admin" />}
                  nativeButton={false}
                  className="hidden md:inline-flex"
                >
                  Admin
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/commandes" aria-label="Mes commandes" />}
                nativeButton={false}
              >
                <Package />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/messages" aria-label="Messages" />}
                nativeButton={false}
                className="relative"
              >
                <MessageCircle />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-[10px]">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/panier" aria-label="Panier" />}
                nativeButton={false}
                className="relative"
              >
                <ShoppingBag />
                {cartCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-[10px]"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  aria-label="Deconnexion"
                >
                  <LogOut />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/auth/connexion" />}
                nativeButton={false}
              >
                Connexion
              </Button>
              <Button
                render={<Link href="/auth/inscription" />}
                nativeButton={false}
                size="sm"
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>

      <MainNav />
    </header>
  );
}
