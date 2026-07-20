import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductCard({
  product,
  showShop = true,
}: {
  product: {
    slug: string;
    title: string;
    priceCents: number;
    images: { url: string }[];
    shop?: { name: string };
  };
  showShop?: boolean;
}) {
  return (
    <Link href={`/produits/${product.slug}`}>
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
        <CardContent className="flex flex-col gap-1 pb-4">
          {showShop && product.shop && (
            <p className="text-sm text-muted-foreground">{product.shop.name}</p>
          )}
          <p className="font-medium">{(product.priceCents / 100).toFixed(2)} EUR</p>
        </CardContent>
      </Card>
    </Link>
  );
}
