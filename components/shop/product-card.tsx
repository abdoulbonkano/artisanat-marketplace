import { Star } from "lucide-react";
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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-secondary/40">
        {product.images[0] && (
          <ProductImage
            src={product.images[0].url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        {wishlisted !== undefined && (
          <WishlistButton
            productId={product.id}
            initialWishlisted={wishlisted}
            className="absolute top-3 right-3"
          />
        )}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <p
          className="font-heading text-xl leading-snug font-medium text-balance transition-colors group-hover/card:text-accent"
          style={{ fontVariationSettings: '"SOFT" 15, "WONK" 1' }}
        >
          {product.title}
        </p>
        {showShop && product.shop && (
          <p
            className="mt-1 font-heading text-[0.95rem] text-primary italic"
            style={{ fontVariationSettings: '"SOFT" 40' }}
          >
            {product.shop.name}
          </p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          {rating && rating.count > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-accent text-accent" strokeWidth={1.5} />
              <span>
                {rating.average.toFixed(1)} ({rating.count})
              </span>
            </div>
          )}
          <span className="ml-auto font-medium tabular-nums">
            {(product.priceCents / 100).toFixed(2)} &euro;
          </span>
        </div>
      </div>
    </Link>
  );
}
