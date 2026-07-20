import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Tous les produits</h1>

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
        <p className="text-sm text-muted-foreground">Aucun produit ne correspond a votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: (typeof products)[number]) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
