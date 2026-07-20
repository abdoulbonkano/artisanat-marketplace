import Link from "next/link";
import {
  Handshake,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Paiement securise",
    description: "Cartes bancaires via Stripe",
  },
  {
    icon: Truck,
    title: "Livraison suivie",
    description: "France et Europe",
  },
  {
    icon: RotateCcw,
    title: "Retours sous 14 jours",
    description: "Conforme au droit europeen",
  },
  {
    icon: Handshake,
    title: "Support reactif",
    description: "Reponse sous 24h",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Pieces uniques",
    description:
      "Chaque objet est faconne a la main par un artisan ou une artisane, pas par une chaine de production.",
  },
  {
    icon: Handshake,
    title: "Vente directe",
    description:
      "Vous achetez chez le createur, sans intermediaire. Le vendeur touche directement ce que vous payez.",
  },
  {
    icon: Store,
    title: "Boutiques independantes",
    description:
      "Chaque vendeur gere sa propre boutique : ses produits, ses prix, son univers.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-6 py-28 text-center sm:py-36">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              Fait main, vendu en direct
            </span>
            <span className="h-px w-10 bg-accent/40" />
          </div>
          <h1 className="max-w-2xl text-5xl leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl">
            L&apos;artisanat, sans intermediaire
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une marketplace ou chaque objet a une main et une histoire
            derriere lui. Decouvrez des createurs independants ou ouvrez
            votre propre boutique.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              render={<Link href="/produits" />}
              nativeButton={false}
            >
              Decouvrir les creations
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/vendeur/onboarding" />}
              nativeButton={false}
            >
              Vendre mes creations
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-1.5 text-center">
              <Icon className="size-5 text-primary" strokeWidth={1.75} />
              <p className="text-xs font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]"
            >
              <CardHeader>
                <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-3xl font-medium tracking-tight">
            Vous creez de vos mains ?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Ouvrez votre boutique en quelques minutes et commencez a vendre
            aupres d&apos;acheteurs qui cherchent du fait main.
          </p>
          <Button
            size="lg"
            render={<Link href="/vendeur/onboarding" />}
            nativeButton={false}
          >
            Devenir vendeur
          </Button>
        </div>
      </section>
    </div>
  );
}
