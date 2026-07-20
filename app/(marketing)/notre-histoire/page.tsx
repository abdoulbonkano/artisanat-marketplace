import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "L'histoire de BONKANO SOLUTIONS : d'une revente d'artisanat en direct sur Leboncoin et Vinted a une marketplace qui formalise notre partenariat avec des artisans independants.",
};

const milestones = [
  {
    icon: MapPin,
    title: "Une vente en direct, sur le terrain",
    description:
      "Avant ce site, la vente se faisait sur Leboncoin, Vinted et sur des marches physiques : des pieces d'artisanat, notamment des bijoux, vendues une a une, en direct.",
  },
  {
    icon: Handshake,
    title: "Un partenariat reel avec des artisans au Niger",
    description:
      "Ces pieces viennent d'artisans partenaires au Niger. Ce n'est pas une relation d'importation anonyme : c'est un partenariat suivi, que nous voulons rendre plus clair et plus durable.",
  },
  {
    icon: Sparkles,
    title: "Une marketplace pour formaliser tout ca",
    description:
      "Ce site est ne de la volonte de sortir de la revente informelle et de donner a ce partenariat un cadre plus propre : des fiches produits honnetes, une boutique dediee, et la possibilite pour d'autres artisans independants de nous rejoindre.",
  },
];

export default function NotreHistoirePage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Notre histoire
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            De la revente en direct a la marketplace
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            BONKANO SOLUTIONS n&apos;est pas partie d&apos;un plan d&apos;affaires,
            mais d&apos;une pratique reelle : vendre en direct des creations
            artisanales, sans intermediaire inutile.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {milestones.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-medium tracking-tight">{title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <h2 className="text-2xl font-medium tracking-tight">
            Ce qui ne change pas
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Que ce soit sur un marche, sur Leboncoin ou sur cette marketplace,
            le principe reste le meme : des pieces uniques, faconnees a la
            main, vendues en direct, sans faire disparaitre la personne qui
            les a creees derriere une marque anonyme.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-accent/8 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="text-2xl font-medium tracking-tight">
            Decouvrez les creations
          </h2>
          <Button size="lg" render={<Link href="/produits" />} nativeButton={false}>
            Voir la boutique
          </Button>
        </div>
      </section>
    </div>
  );
}
