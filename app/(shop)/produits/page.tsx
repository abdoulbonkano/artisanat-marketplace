import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tous les produits",
  description:
    "Parcourez les creations faites main de nos artisans independants : bijoux, ceramique, textile, maroquinerie et plus.",
};

const sortLabel: Record<string, string> = {
  recent: "Plus recent",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix decroissant",
  populaire: "Plus populaire",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{
    categorie?: string;
    q?: string;
    prixMin?: string;
    prixMax?: string;
    tri?: string;
  }>;
}) {
  const { categorie, q, prixMin, prixMax, tri } = await searchParams;
  const sort = tri && sortLabel[tri] ? tri : "recent";

  const priceFilter: { gte?: number; lte?: number } = {};
  const minCents = prixMin ? Math.round(Number(prixMin) * 100) : undefined;
  const maxCents = prixMax ? Math.round(Number(prixMax) * 100) : undefined;
  if (minCents && !Number.isNaN(minCents)) priceFilter.gte = minCents;
  if (maxCents && !Number.isNaN(maxCents)) priceFilter.lte = maxCents;

  // Typo-tolerant search: pg_trgm ranks candidate ids by similarity, then the
  // main Prisma query still enforces status/category/price filters normally.
  let searchIds: string[] | undefined;
  if (q) {
    const matches = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Product"
      WHERE title ILIKE ${"%" + q + "%"} OR description ILIKE ${"%" + q + "%"}
         OR similarity(title, ${q}) > 0.2 OR similarity(description, ${q}) > 0.15
      ORDER BY GREATEST(similarity(title, ${q}), similarity(description, ${q})) DESC
      LIMIT 200
    `;
    searchIds = matches.map((m) => m.id);
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        shop: { status: "ACTIVE" },
        category: categorie ? { slug: categorie } : undefined,
        priceCents: Object.keys(priceFilter).length > 0 ? priceFilter : undefined,
        id: searchIds ? { in: searchIds } : undefined,
      },
      include: {
        shop: true,
        category: true,
        images: { orderBy: { position: "asc" }, take: 1 },
      },
      orderBy:
        sort === "prix-asc"
          ? { priceCents: "asc" }
          : sort === "prix-desc"
            ? { priceCents: "desc" }
            : { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (searchIds && sort === "recent") {
    const rank = new Map(searchIds.map((id, index) => [id, index]));
    products.sort(
      (a: (typeof products)[number], b: (typeof products)[number]) =>
        (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0),
    );
  }

  const [ratings, popularity, session] = await Promise.all([
    prisma.review.groupBy({
      by: ["productId"],
      where: { productId: { in: products.map((p: (typeof products)[number]) => p.id) }, hiddenAt: null },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: products.map((p: (typeof products)[number]) => p.id) },
        order: { status: { in: ["PAID", "FULFILLED"] } },
      },
      _sum: { quantity: true },
    }),
    auth(),
  ]);
  const ratingByProduct = new Map(
    ratings.map((r: (typeof ratings)[number]) => [
      r.productId,
      { average: r._avg.rating ?? 0, count: r._count.rating },
    ]),
  );
  const popularityByProduct = new Map(
    popularity.map((p: (typeof popularity)[number]) => [p.productId, p._sum.quantity ?? 0]),
  );

  if (sort === "populaire") {
    products.sort(
      (a: (typeof products)[number], b: (typeof products)[number]) =>
        (popularityByProduct.get(b.id) ?? 0) - (popularityByProduct.get(a.id) ?? 0),
    );
  }

  const wishlisted = session?.user
    ? await prisma.wishlist.findMany({
        where: {
          userId: session.user.id,
          productId: { in: products.map((p: (typeof products)[number]) => p.id) },
        },
      })
    : [];
  const wishlistedIds = new Set(wishlisted.map((w: (typeof wishlisted)[number]) => w.productId));

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
        <div className="flex flex-col gap-1">
          <label htmlFor="tri" className="text-xs text-muted-foreground">
            Trier par
          </label>
          <select
            id="tri"
            name="tri"
            defaultValue={sort}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {Object.entries(sortLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
              wishlisted={session?.user ? wishlistedIds.has(product.id) : undefined}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
