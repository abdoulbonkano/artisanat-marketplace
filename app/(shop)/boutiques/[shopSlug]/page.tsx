import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Package, Store } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

const getShop = cache(async (shopSlug: string) => {
  return prisma.shop.findUnique({
    where: { slug: shopSlug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}): Promise<Metadata> {
  const { shopSlug } = await params;
  const shop = await getShop(shopSlug);

  if (!shop || shop.status !== "ACTIVE") {
    return {};
  }

  return {
    title: shop.name,
    description:
      shop.description?.slice(0, 160) ??
      `Decouvrez les creations de la boutique ${shop.name}.`,
    openGraph: {
      title: shop.name,
      images: shop.bannerUrl ? [{ url: shop.bannerUrl }] : undefined,
    },
  };
}

export default async function BoutiquePage({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;

  const shop = await getShop(shopSlug);

  if (!shop || shop.status !== "ACTIVE") {
    notFound();
  }

  const ratings = await prisma.review.groupBy({
    by: ["productId"],
    where: {
      productId: { in: shop.products.map((p: (typeof shop.products)[number]) => p.id) },
      hiddenAt: null,
    },
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
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-secondary/40 sm:aspect-[4/1]">
        {shop.bannerUrl && (
          <Image
            src={shop.bannerUrl}
            alt={`Banniere de ${shop.name}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <div className="relative -mt-10 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-secondary shadow-md sm:size-28">
            {shop.logoUrl ? (
              <Image
                src={shop.logoUrl}
                alt={`Logo de ${shop.name}`}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <Store className="size-9 text-muted-foreground" strokeWidth={1.5} />
            )}
          </div>
          <div className="pt-2">
            <h1 className="text-3xl font-medium tracking-tight">{shop.name}</h1>
            {shop.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {shop.description}
              </p>
            )}
          </div>
        </div>

        <div className="pb-8">
          {shop.products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Cette boutique n'a pas encore de produit publie"
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {shop.products.map((product: (typeof shop.products)[number]) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showShop={false}
                  rating={ratingByProduct.get(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
