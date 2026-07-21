import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { startConversationAction } from "@/actions/messages";
import { WishlistButton } from "@/components/products/wishlist-button";
import { StarRating } from "@/components/reviews/star-rating";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      shop: true,
      category: true,
      images: { orderBy: { position: "asc" } },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || product.status !== "PUBLISHED" || product.shop.status !== "ACTIVE") {
    return {};
  }

  const description = product.description.slice(0, 160);

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProduitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product || product.status !== "PUBLISHED" || product.shop.status !== "ACTIVE") {
    notFound();
  }

  const [mainImage, ...otherImages] = product.images;

  const [reviewAgg, reviews] = await Promise.all([
    prisma.review.aggregate({
      where: { productId: product.id, hiddenAt: null },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.review.findMany({
      where: { productId: product.id, hiddenAt: null },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  const averageRating = reviewAgg._avg.rating ?? 0;
  const reviewCount = reviewAgg._count.rating;

  const session = await auth();
  const wishlistEntry = session?.user
    ? await prisma.wishlist.findUnique({
        where: { userId_productId: { userId: session.user.id, productId: product.id } },
      })
    : null;

  const similarProducts = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          status: "PUBLISHED",
          shop: { status: "ACTIVE" },
        },
        include: { shop: true, images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 lg:py-16">
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      <div className="flex flex-col gap-3 lg:w-1/2 lg:shrink-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-[0_4px_8px_-4px_rgba(36,28,16,0.08),0_20px_36px_-16px_rgba(36,28,16,0.2)]">
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
            />
          )}
        </div>
        {otherImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {otherImages.map((image: (typeof otherImages)[number], index: number) => (
              <div
                key={image.id}
                className="relative size-20 overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={image.url}
                  alt={`${product.title} - photo ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:w-1/2">
        <div className="flex flex-col gap-3">
          {product.category && (
            <Link href={`/produits?categorie=${product.category.slug}`} className="w-fit">
              <Badge variant="secondary">{product.category.name}</Badge>
            </Link>
          )}
          <h1 className="text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
            {product.title}
          </h1>
          <Link
            href={`/boutiques/${product.shop.slug}`}
            className="w-fit text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            {product.shop.name}
          </Link>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviewCount} avis)
              </span>
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {product.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <span className="font-heading text-4xl font-medium tracking-tight tabular-nums text-accent">
            {(product.priceCents / 100).toFixed(2)} EUR
          </span>
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AddToCartForm productId={product.id} stock={product.stock} />
          <form action={startConversationAction.bind(null, product.shop.id, product.id)}>
            <Button type="submit" variant="outline" size="lg">
              Contacter le vendeur
            </Button>
          </form>
          {session?.user && (
            <WishlistButton
              productId={product.id}
              initialWishlisted={Boolean(wishlistEntry)}
              className="static size-11 border border-border"
            />
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:gap-5">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-3.5 shrink-0" strokeWidth={1.75} />
            </span>
            <span>Paiement securise par Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="size-3.5 shrink-0" strokeWidth={1.75} />
            </span>
            <span>Livraison suivie, France et Europe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RotateCcw className="size-3.5 shrink-0" strokeWidth={1.75} />
            </span>
            <span>Retours acceptes sous 14 jours</span>
          </div>
        </div>
      </div>
    </div>

      {reviews.length > 0 && (
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8">
          <h2 className="font-heading text-xl font-medium tracking-tight">
            Avis clients ({reviewCount})
          </h2>
          <div className="flex flex-col gap-4">
            {reviews.map((review: (typeof reviews)[number]) => (
              <div key={review.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{review.author.name}</span>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {similarProducts.length > 0 && (
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8">
          <h2 className="font-heading text-xl font-medium tracking-tight">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {similarProducts.map((similar: (typeof similarProducts)[number]) => (
              <ProductCard key={similar.id} product={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
