import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const values = [
  {
    title: "Pieces uniques",
    description:
      "Chaque objet est faconne a la main par un artisan ou une artisane, pas par une chaine de production.",
  },
  {
    title: "Vente directe",
    description:
      "Vous achetez chez le createur, sans intermediaire. Le vendeur touche directement ce que vous payez.",
  },
  {
    title: "Boutiques independantes",
    description:
      "Chaque vendeur gere sa propre boutique : ses produits, ses prix, son univers.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="text-xs font-medium tracking-[0.14em] text-accent uppercase">
            Fait main, vendu en direct
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            L&apos;artisanat, sans intermediaire
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Une marketplace ou chaque objet a une main et une histoire
            derriere lui. Decouvrez des createurs independants ou ouvrez
            votre propre boutique.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
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

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="border-border/80">
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="text-2xl font-medium tracking-tight">
            Vous creez de vos mains ?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Ouvrez votre boutique en quelques minutes et commencez a vendre
            aupres d&apos;acheteurs qui cherchent du fait main.
          </p>
          <Button
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
