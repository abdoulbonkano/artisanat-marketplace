import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export default async function ProduitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { shop: true, category: true },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        {product.category && (
          <Link href={`/produits?categorie=${product.category.slug}`}>
            <Badge variant="secondary">{product.category.name}</Badge>
          </Link>
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
        <Link href={`/boutiques/${product.shop.slug}`} className="text-sm underline">
          {product.shop.name}
        </Link>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed">
        {product.description}
      </p>

      <div className="flex items-center gap-4">
        <span className="text-2xl font-semibold">
          {(product.priceCents / 100).toFixed(2)} EUR
        </span>
        <span className="text-sm text-muted-foreground">
          {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
        </span>
      </div>
    </div>
  );
}
