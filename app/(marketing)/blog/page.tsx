import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Le blog de la marketplace arrive bientot : coulisses de l'artisanat, rencontres avec nos artisans partenaires, nouveautes.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Newspaper className="size-6" strokeWidth={1.75} />
      </div>
      <h1 className="text-3xl font-medium tracking-tight">
        Le blog arrive bientot
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        On y racontera les coulisses de l&apos;artisanat, les rencontres avec
        nos artisans partenaires et les nouveautes de la marketplace. En
        attendant, decouvrez les creations deja en ligne.
      </p>
      <Button render={<Link href="/produits" />} nativeButton={false}>
        Voir la boutique
      </Button>
    </div>
  );
}
