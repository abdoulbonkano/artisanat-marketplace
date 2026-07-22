import Link from "next/link";
import { Compass } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary/60 text-accent">
          <Compass className="size-7" strokeWidth={1.5} />
        </span>
        <p className="font-heading text-6xl font-medium tracking-tight text-accent">404</p>
        <h1 className="text-2xl font-medium tracking-tight text-balance">
          Cette page s&apos;est egaree
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Le lien est peut-etre errone ou la page a ete deplacee. Retournez a
          l&apos;accueil ou parcourez nos creations.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/" />} nativeButton={false}>
            Retour a l&apos;accueil
          </Button>
          <Button render={<Link href="/produits" />} nativeButton={false} variant="outline">
            Voir les creations
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
