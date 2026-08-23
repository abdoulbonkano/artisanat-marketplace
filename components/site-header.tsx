import Link from "next/link";
import {
  Heart,
  LogOut,
  MessageCircle,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark, Wordmark } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { EmailVerificationBanner } from "@/components/auth/email-verification-banner";
import { SITE_NAME } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  const dbUser = user
    ? await prisma.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } })
    : null;

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
      {dbUser && !dbUser.emailVerified && <EmailVerificationBanner />}
      <div className="flex items-center gap-4 px-4 py-3.5 sm:gap-6 sm:px-6">
        <MobileNav
          isAuthenticated={Boolean(user)}
          role={user?.role}
          unreadCount={unreadCount}
        />

        <Link
          href="/"
          aria-label={SITE_NAME}
          className="flex shrink-0 items-center gap-2 font-heading text-xl font-medium tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LogoMark className="size-4" />
          </span>
          <Wordmark className="hidden sm:inline" aria-hidden="true" />
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
          <ThemeToggle className="hidden md:inline-flex" />
          {user ? (
            <>
              {(user.role === "SELLER" || user.role === "ADMIN") && (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/vendeur" />}
                  nativeButton={false}
                  className="hidden gap-1.5 border-primary/25 text-primary hover:bg-primary/5 md:inline-flex"
                >
                  <Store className="size-3.5" />
                  Espace vendeur
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
                render={<Link href="/favoris" aria-label="Mes favoris" />}
                nativeButton={false}
                className="hidden md:inline-flex"
              >
                <Heart />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/commandes" aria-label="Mes commandes" />}
                nativeButton={false}
                className="hidden md:inline-flex"
              >
                <Package />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/messages" aria-label="Messages" />}
                nativeButton={false}
                className="relative size-11 md:size-8"
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
                className="relative size-11 md:size-8"
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

              <Button
                variant="ghost"
                size="icon"
                render={<Link href="/compte" aria-label="Mon compte" />}
                nativeButton={false}
                className="hidden md:inline-flex"
              >
                <Settings />
              </Button>

              <form action={signOutAction} className="hidden md:block">
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
                className="hidden sm:inline-flex"
              >
                Connexion
              </Button>
              <Button
                render={<Link href="/auth/inscription" />}
                nativeButton={false}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <MainNav />
      </div>
    </header>
  );
}
