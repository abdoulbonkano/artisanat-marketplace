import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { startConversationAction } from "@/actions/messages";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function ProduitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      shop: true,
      category: true,
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product || product.status !== "PUBLISHED" || product.shop.status !== "ACTIVE") {
    notFound();
  }

  const [mainImage, ...otherImages] = product.images;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-12 lg:py-16">
      <div className="flex flex-col gap-3 lg:w-1/2 lg:shrink-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-[0_4px_8px_-4px_rgba(36,28,16,0.08),0_20px_36px_-16px_rgba(36,28,16,0.2)]">
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
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {product.description}
        </p>

        <div className="flex items-baseline gap-3 border-t border-border pt-6">
          <span className="text-3xl font-semibold tabular-nums">
            {(product.priceCents / 100).toFixed(2)} EUR
          </span>
          <span className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AddToCartForm productId={product.id} stock={product.stock} />
          <form action={startConversationAction.bind(null, product.shop.id, product.id)}>
            <Button type="submit" variant="outline" size="lg">
              Contacter le vendeur
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
            <span>Paiement securise par Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
            <span>Livraison suivie, France et Europe</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
            <span>Retours acceptes sous 14 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
