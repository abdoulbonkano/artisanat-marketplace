import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/product-card";
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
            <ProductCard key={product.id} product={product} showShop={false} />
          ))}
        </div>
      )}
    </div>
  );
}
