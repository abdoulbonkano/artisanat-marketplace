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

const marqueeItems = [
  "Fait main",
  "Vendu en direct",
  "Artisans partenaires",
  "Pieces uniques",
  "Sans intermediaire",
];

const categoryTints = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-foreground text-background",
  "bg-secondary text-secondary-foreground",
];

const trustTints = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-foreground text-background",
  "bg-primary text-primary-foreground",
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
    prisma.category.findMany({
      where: { products: { some: { status: "PUBLISHED", shop: { status: "ACTIVE" } } } },
      orderBy: { name: "asc" },
      take: 8,
    }),
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
  const heroProduct = featuredProducts.find((p: (typeof featuredProducts)[number]) => p.images[0]);
  const heroImage = heroProduct?.images[0];

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-grain relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-32">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
              <Sparkles className="size-3.5" strokeWidth={2} />
              Fait main, vendu en direct
            </span>
            <h1 className="max-w-xl text-6xl leading-[0.98] font-medium tracking-tight text-balance sm:text-7xl lg:text-8xl">
              L&apos;artisanat,{" "}
              <span className="text-accent italic">sans</span> intermediaire
            </h1>
            <p className="max-w-md text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
              Une marketplace ou chaque objet a une main et une histoire
              derriere lui. Decouvrez des createurs independants ou ouvrez
              votre propre boutique.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                render={<Link href="/produits" />}
                nativeButton={false}
              >
                Decouvrir les creations
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                render={<Link href="/vendeur/onboarding" />}
                nativeButton={false}
              >
                Vendre mes creations
              </Button>
            </div>
          </div>

          {heroImage && heroProduct && (
            <div className="relative mx-auto hidden w-full max-w-xs lg:block">
              <div className="relative aspect-[4/5] w-full rotate-2 overflow-hidden rounded-[2rem] border-4 border-primary-foreground/15 shadow-2xl transition-transform duration-500 hover:rotate-0">
                <Image
                  src={heroImage.url}
                  alt={heroProduct.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="absolute -bottom-6 -left-8 -rotate-3 rounded-2xl bg-background px-5 py-3 text-foreground shadow-xl">
                <p className="text-xs text-muted-foreground">
                  {heroProduct.shop.name}
                </p>
                <p className="font-heading text-lg font-medium">
                  {(heroProduct.priceCents / 100).toFixed(2)} &euro;
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="overflow-hidden border-b border-border bg-accent py-2.5 text-accent-foreground">
        <div className="flex w-max animate-marquee gap-10 text-sm font-semibold tracking-[0.14em] uppercase">
          {[...Array(2)].map((_, dupeIndex) => (
            <div key={dupeIndex} className="flex shrink-0 gap-10">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center gap-10">
                  {item}
                  <span className="text-accent-foreground/40">&bull;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="border-b border-border bg-secondary/30 px-6 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, description }, index) => {
            const tint = trustTints[index % trustTints.length];
            return (
              <div
                key={title}
                className="group flex flex-col items-center gap-3 rounded-2xl px-4 py-6 text-center transition-all duration-200 hover:-translate-y-1.5 hover:bg-background hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${tint}`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-b border-border px-6 py-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <h2 className="text-3xl font-medium tracking-tight">
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
                    className={`group/cat flex flex-col items-center gap-3 rounded-3xl px-4 py-8 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg ${tint}`}
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-background/20 transition-transform duration-200 group-hover/cat:scale-110 group-hover/cat:rotate-6">
                      <Icon className="size-5.5" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-semibold">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="border-b border-border px-6 py-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-3xl font-medium tracking-tight">
                Dernieres creations
              </h2>
              <Link
                href="/produits"
                className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:text-foreground"
              >
                Voir tous les produits &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product: (typeof featuredProducts)[number]) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {spotlightShop && spotlightImage && (
        <section className="border-b border-border px-6 py-16">
          <div className="bg-grain relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-foreground text-background">
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
                <span className="inline-flex w-fit -rotate-2 items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-[0.14em] text-accent-foreground uppercase">
                  <Sparkles className="size-3" strokeWidth={2} />
                  Createur a la une
                </span>
                <h2 className="text-3xl font-medium tracking-tight">
                  {spotlightShop.name}
                </h2>
                {spotlightShop.description && (
                  <p className="text-sm leading-relaxed text-background/70">
                    {spotlightShop.description}
                  </p>
                )}
                <Button
                  className="mt-2 w-fit"
                  variant="secondary"
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
              className="rounded-3xl border-border/70 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]"
            >
              <CardHeader>
                <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
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

      <section className="border-t border-border bg-accent/8 px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-12">
          <h2 className="text-center text-3xl font-medium tracking-tight">
            Comment ca fonctionne
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center gap-2 text-center">
                <span
                  aria-hidden
                  className="font-heading pointer-events-none absolute -top-8 text-8xl font-semibold text-primary/8"
                >
                  {step.number}
                </span>
                <span className="font-heading relative flex size-12 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
                  {step.number}
                </span>
                <p className="relative font-medium">{step.title}</p>
                <p className="relative text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grain relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-4xl font-medium tracking-tight">
            Vous <span className="text-accent italic">creez</span> de vos mains ?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/75">
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
