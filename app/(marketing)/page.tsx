import Image from "next/image";
import Link from "next/link";
import {
  Amphora,
  Armchair,
  Briefcase,
  Handshake,
  PenTool,
  RotateCcw,
  ShieldCheck,
  Shirt,
  Sparkles,
  Store,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

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

const steps = [
  {
    number: "1",
    title: "L'artisan cree",
    description: "Chaque piece est faconnee a la main, en petite serie.",
  },
  {
    number: "2",
    title: "Vous commandez",
    description: "Paiement securise, directement au createur de la piece.",
  },
  {
    number: "3",
    title: "Vous recevez",
    description: "Livraison suivie, avec le vendeur joignable par message.",
  },
];

const categoryTints = [
  "bg-primary/10 text-primary",
  "bg-accent/12 text-accent",
  "bg-secondary text-secondary-foreground",
];

function categoryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("bijou")) return Sparkles;
  if (n.includes("bois") || n.includes("mobilier")) return Armchair;
  if (n.includes("ceramique") || n.includes("poterie")) return Amphora;
  if (n.includes("cuir") || n.includes("maroquinerie")) return Briefcase;
  if (n.includes("papeterie") || n.includes("illustration")) return PenTool;
  if (n.includes("textile") || n.includes("couture")) return Shirt;
  return Tag;
}

export default async function Home() {
  const [categories, featuredProducts, spotlightShop] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, take: 8 }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", shop: { status: "ACTIVE" } },
      include: { shop: true, images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.shop.findFirst({
      where: { status: "ACTIVE", products: { some: { status: "PUBLISHED" } } },
      include: {
        products: {
          where: { status: "PUBLISHED" },
          include: { images: { orderBy: { position: "asc" }, take: 1 } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const spotlightImage = spotlightShop?.products[0]?.images[0];

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-24">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
              Fait main, vendu en direct
            </span>
            <span className="h-px w-10 bg-accent/40" />
          </div>
          <h1 className="max-w-2xl text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-7xl">
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

      <section className="border-b border-border">
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

      {categories.length > 0 && (
        <section className="border-b border-border px-6 py-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <h2 className="text-2xl font-medium tracking-tight">
              Parcourir par categorie
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.map((category: (typeof categories)[number], index: number) => {
                const Icon = categoryIcon(category.name);
                const tint = categoryTints[index % categoryTints.length];
                return (
                  <Link
                    key={category.id}
                    href={`/produits?categorie=${category.slug}`}
                    className={`group/cat flex flex-col items-center gap-2 rounded-2xl px-4 py-7 text-center transition-all duration-200 hover:-translate-y-1 ${tint.split(" ")[0]}`}
                  >
                    <div className={`flex size-11 items-center justify-center rounded-full bg-background/70 transition-transform duration-200 group-hover/cat:scale-110 ${tint.split(" ")[1]}`}>
                      <Icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="border-b border-border px-6 py-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-medium tracking-tight">
                Dernieres creations
              </h2>
              <Link
                href="/produits"
                className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                Voir tous les produits
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product: (typeof featuredProducts)[number]) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {spotlightShop && spotlightImage && (
        <section className="border-b border-border px-6 py-14">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-secondary/40">
            <div className="flex flex-col sm:flex-row">
              <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:w-1/2">
                <Image
                  src={spotlightImage.url}
                  alt={spotlightShop.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 px-8 py-10 sm:w-1/2">
                <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                  Createur a la une
                </span>
                <h2 className="text-2xl font-medium tracking-tight">
                  {spotlightShop.name}
                </h2>
                {spotlightShop.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {spotlightShop.description}
                  </p>
                )}
                <Button
                  className="mt-2 w-fit"
                  render={<Link href={`/boutiques/${spotlightShop.slug}`} />}
                  nativeButton={false}
                >
                  Decouvrir la boutique
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20">
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

      <section className="border-t border-border bg-accent/8 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <h2 className="text-center text-2xl font-medium tracking-tight">
            Comment ca fonctionne
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center gap-2 text-center">
                <span className="font-heading flex size-11 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
                  {step.number}
                </span>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-3xl font-medium tracking-tight">
            Vous creez de vos mains ?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
            Ouvrez votre boutique en quelques minutes et commencez a vendre
            aupres d&apos;acheteurs qui cherchent du fait main.
          </p>
          <Button
            size="lg"
            variant="secondary"
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
