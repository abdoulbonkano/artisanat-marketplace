import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { WishlistButton } from "@/components/products/wishlist-button";
import { ProductImage } from "@/components/ui/product-image";

export function ProductCard({
  product,
  showShop = true,
  rating,
  wishlisted,
}: {
  product: {
    id: string;
    slug: string;
    title: string;
    priceCents: number;
    images: { url: string }[];
    shop?: { name: string };
  };
  showShop?: boolean;
  rating?: { average: number; count: number };
  wishlisted?: boolean;
}) {
  return (
    <Link href={`/produits/${product.slug}`} className="group/card block">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-secondary/40 ring-1 ring-foreground/8 transition-shadow duration-300 group-hover/card:shadow-[0_8px_16px_-6px_rgba(36,28,16,0.12),0_24px_36px_-16px_rgba(36,28,16,0.22)]">
        {product.images[0] && (
          <ProductImage
            src={product.images[0].url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.08]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
        <div className="absolute right-3 bottom-3 left-3 flex translate-y-2 items-center justify-between text-primary-foreground opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <span className="text-xs font-semibold tracking-[0.1em] uppercase">
            Voir la piece
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </span>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-background px-3 py-1 text-sm font-semibold tracking-tight shadow-sm">
          {(product.priceCents / 100).toFixed(2)} &euro;
        </span>
        {wishlisted !== undefined && (
          <WishlistButton
            productId={product.id}
            initialWishlisted={wishlisted}
            className="absolute top-3 right-3"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-1 pt-3">
        <p className="font-heading text-base leading-snug font-medium transition-colors group-hover/card:text-accent">
          {product.title}
        </p>
        {showShop && product.shop && (
          <p className="text-sm text-muted-foreground">{product.shop.name}</p>
        )}
        {rating && rating.count > 0 && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-accent text-accent" strokeWidth={1.5} />
            <span>
              {rating.average.toFixed(1)} ({rating.count})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
