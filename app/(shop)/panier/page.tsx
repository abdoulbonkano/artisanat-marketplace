import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { removeCartItemAction, updateCartItemAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function PanierPage() {
  const user = await requireUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } },
        orderBy: { id: "asc" },
      },
    },
  });

  const items = cart?.items ?? [];
  const total = items.reduce(
    (sum: number, item: (typeof items)[number]) =>
      sum + item.product.priceCents * item.quantity,
    0,
  );

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mon panier</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          action={
            <Button render={<Link href="/produits" />} nativeButton={false} size="sm">
              Parcourir les produits
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item: (typeof items)[number]) => {
            const boundUpdate = updateCartItemAction.bind(null, item.id);
            const boundRemove = removeCartItemAction.bind(null, item.id);
            const image = item.product.images[0];

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-4 last:border-none"
              >
                {image && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={image.url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <Link
                    href={`/produits/${item.product.slug}`}
                    className="font-medium underline"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {(item.product.priceCents / 100).toFixed(2)} EUR piece
                  </p>
                </div>
                <form action={boundUpdate} className="flex items-center gap-2">
                  <Input
                    type="number"
                    name="quantity"
                    defaultValue={item.quantity}
                    min={0}
                    max={item.product.stock}
                    className="w-20"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Mettre a jour
                  </Button>
                </form>
                <form action={boundRemove}>
                  <Button type="submit" variant="destructive" size="sm">
                    Retirer
                  </Button>
                </form>
                <p className="w-24 text-right font-medium">
                  {((item.product.priceCents * item.quantity) / 100).toFixed(2)} EUR
                </p>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-4">
            <p className="text-lg font-semibold">
              Total : {(total / 100).toFixed(2)} EUR
            </p>
            <Button render={<Link href="/checkout" />} nativeButton={false}>
              Passer la commande
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
