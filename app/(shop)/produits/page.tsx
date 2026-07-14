import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        category: categorie ? { slug: categorie } : undefined,
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
        <p className="text-sm text-muted-foreground">Aucun produit pour le moment.</p>
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
