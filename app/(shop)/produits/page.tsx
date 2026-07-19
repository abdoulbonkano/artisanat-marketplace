import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

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

  const priceFilter: Prisma.IntFilter = {};
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
        {categories.map((category) => (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/produits/${product.slug}`}>
              <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                {product.images[0] && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">{product.shop.name}</p>
                  <p className="font-medium">
                    {(product.priceCents / 100).toFixed(2)} EUR
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
