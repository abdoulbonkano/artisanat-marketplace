import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;

  const shop = await prisma.shop.findUnique({
    where: { slug: shopSlug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shop || shop.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{shop.name}</h1>
        {shop.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {shop.description}
          </p>
        )}
      </div>

      {shop.products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Cette boutique n&apos;a pas encore de produit publie.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shop.products.map((product: (typeof shop.products)[number]) => (
            <Link key={product.id} href={`/produits/${product.slug}`}>
              <Card className="h-full overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]">
                {product.images[0] && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <CardHeader className="pt-4">
                  <CardTitle className="text-base">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
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
