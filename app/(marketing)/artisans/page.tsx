import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nos artisans",
  description:
    "Decouvrez les createurs independants qui vendent en direct sur la marketplace : leur boutique, leur univers, leurs creations faites main.",
};

export default async function ArtisansPage() {
  const shops = await prisma.shop.findMany({
    where: { status: "ACTIVE", products: { some: { status: "PUBLISHED" } } },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { products: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Nos artisans
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Des createurs, pas des catalogues
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Chaque boutique est geree par un vendeur independant. Vous
            achetez directement chez la personne qui a faconne l&apos;objet.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          {shops.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun artisan n&apos;a encore ouvert de boutique.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop: (typeof shops)[number]) => {
                const image = shop.products[0]?.images[0];
                return (
                  <Link
                    key={shop.id}
                    href={`/boutiques/${shop.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_6px_-2px_rgba(36,28,16,0.06),0_16px_28px_-12px_rgba(36,28,16,0.18)]"
                  >
                    <div className="relative aspect-[4/3] w-full bg-secondary/40">
                      {image ? (
                        <ProductImage
                          src={image.url}
                          alt={shop.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          Pas encore de photo
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <h2 className="text-lg font-medium tracking-tight">
                        {shop.name}
                      </h2>
                      {shop.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {shop.description}
                        </p>
                      )}
                      <span className="mt-1 text-xs text-muted-foreground">
                        {shop._count.products}{" "}
                        {shop._count.products > 1 ? "produits" : "produit"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight">
            Vous creez de vos mains ?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
            Ouvrez votre boutique en quelques minutes et rejoignez les
            artisans qui vendent deja en direct.
          </p>
          <Button
            size="lg"
            variant="secondary"
            render={<Link href="/vendeur/onboarding" />}
            nativeButton={false}
          >
            Devenir vendeur
          </Button>
        </div>
      </section>
    </div>
  );
}
