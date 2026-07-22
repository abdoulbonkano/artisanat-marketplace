"use client";

import Link from "next/link";
import {
  Heart,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  Store,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { mainNavItems } from "@/components/main-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav({
  isAuthenticated,
  role,
  unreadCount,
}: {
  isAuthenticated: boolean;
  role?: "BUYER" | "SELLER" | "ADMIN";
  unreadCount: number;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            className="size-11 md:hidden"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <div className="mt-10 flex items-center gap-2">
          <form action="/produits" method="get" className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" placeholder="Rechercher..." className="h-10 rounded-full pl-9" />
          </form>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-1 py-2">
          {mainNavItems.map((item) => (
            <SheetClose
              key={item.href}
              render={<Link href={item.href} />}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>

        <div className="my-2 border-t border-border" />

        {isAuthenticated ? (
          <nav className="flex flex-col gap-1 py-2">
            <SheetClose
              render={<Link href="/favoris" />}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <Heart className="size-4" />
              Mes favoris
            </SheetClose>
            <SheetClose
              render={<Link href="/commandes" />}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <Package className="size-4" />
              Mes commandes
            </SheetClose>
            <SheetClose
              render={<Link href="/messages" />}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <MessageCircle className="size-4" />
              Messages
              {unreadCount > 0 && <Badge className="ml-auto h-5 min-w-5 justify-center px-1">{unreadCount}</Badge>}
            </SheetClose>
            <SheetClose
              render={<Link href="/compte" />}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <Settings className="size-4" />
              Mon compte
            </SheetClose>
            {(role === "SELLER" || role === "ADMIN") && (
              <SheetClose
                render={<Link href="/vendeur" />}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Store className="size-4" />
                Espace vendeur
              </SheetClose>
            )}
            {role === "BUYER" && (
              <SheetClose
                render={<Link href="/vendeur/onboarding" />}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Store className="size-4" />
                Devenir vendeur
              </SheetClose>
            )}
            {role === "ADMIN" && (
              <SheetClose
                render={<Link href="/admin" />}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Admin
              </SheetClose>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Deconnexion
              </button>
            </form>
          </nav>
        ) : (
          <nav className="flex flex-col gap-2 py-2">
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/auth/connexion" />}
              nativeButton={false}
            >
              Connexion
            </Button>
            <Button className="w-full" render={<Link href="/auth/inscription" />} nativeButton={false}>
              Inscription
            </Button>
          </nav>
        )}
      </SheetContent>
    </Sheet>
  );
}
