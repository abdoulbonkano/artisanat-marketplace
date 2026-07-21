import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tous les produits",
  description:
    "Parcourez les creations faites main de nos artisans independants : bijoux, ceramique, textile, maroquinerie et plus.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{
    categorie?: string;
    q?: string;
    prixMin?: string;
    prixMax?: string;
  }>;
}) {
  const { categorie, q, prixMin, prixMax } = await searchParams;

  const priceFilter: { gte?: number; lte?: number } = {};
  const minCents = prixMin ? Math.round(Number(prixMin) * 100) : undefined;
  const maxCents = prixMax ? Math.round(Number(prixMax) * 100) : undefined;
  if (minCents && !Number.isNaN(minCents)) priceFilter.gte = minCents;
  if (maxCents && !Number.isNaN(maxCents)) priceFilter.lte = maxCents;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        shop: { status: "ACTIVE" },
        category: categorie ? { slug: categorie } : undefined,
        priceCents: Object.keys(priceFilter).length > 0 ? priceFilter : undefined,
        OR: q
          ? [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        shop: true,
        category: true,
        images: { orderBy: { position: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const ratings = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: products.map((p: (typeof products)[number]) => p.id) }, hiddenAt: null },
    _avg: { rating: true },
    _count: { rating: true },
  });
  const ratingByProduct = new Map(
    ratings.map((r: (typeof ratings)[number]) => [
      r.productId,
      { average: r._avg.rating ?? 0, count: r._count.rating },
    ]),
  );

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30 px-6 py-14 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Boutique
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Toutes les creations
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Bijoux, ceramique, textile, maroquinerie... faconnes a la main par
            des artisans independants.
          </p>
        </div>
      </section>

      <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <form method="get" className="flex flex-wrap items-end gap-3">
        {categorie && <input type="hidden" name="categorie" value={categorie} />}
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-xs text-muted-foreground">
            Recherche
          </label>
          <Input id="q" name="q" defaultValue={q} placeholder="Vase, bijou..." className="w-48" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="prixMin" className="text-xs text-muted-foreground">
            Prix min (EUR)
          </label>
          <Input
            id="prixMin"
            name="prixMin"
            type="number"
            min="0"
            step="0.01"
            defaultValue={prixMin}
            className="w-28"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="prixMax" className="text-xs text-muted-foreground">
            Prix max (EUR)
          </label>
          <Input
            id="prixMax"
            name="prixMax"
            type="number"
            min="0"
            step="0.01"
            defaultValue={prixMax}
            className="w-28"
          />
        </div>
        <Button type="submit" variant="outline">
          Filtrer
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href="/produits">
          <Badge variant={!categorie ? "default" : "secondary"}>Tout</Badge>
        </Link>
        {categories.map((category: (typeof categories)[number]) => (
          <Link key={category.id} href={`/produits?categorie=${category.slug}`}>
            <Badge variant={categorie === category.slug ? "default" : "secondary"}>
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Aucun produit ne correspond a votre recherche"
          description="Essayez d'autres mots-cles ou reinitialisez les filtres."
          action={
            <Button render={<Link href="/produits" />} nativeButton={false} size="sm" variant="outline">
              Reinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: (typeof products)[number]) => (
            <ProductCard
              key={product.id}
              product={product}
              rating={ratingByProduct.get(product.id)}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
