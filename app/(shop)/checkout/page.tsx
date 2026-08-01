import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { ProductImage } from "@/components/ui/product-image";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const user = await requireUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/panier");
  }

  const total = cart.items.reduce(
    (sum: number, item: (typeof cart.items)[number]) =>
      sum + item.product.priceCents * item.quantity,
    0,
  );

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-8 sm:flex-row sm:gap-8">
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Livraison et paiement
        </h1>
        <CheckoutForm />
      </div>
      <div className="w-full max-w-sm shrink-0 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-medium">Recapitulatif</h2>
        <div className="flex flex-col gap-4">
          {cart.items.map((item: (typeof cart.items)[number]) => {
            const image = item.product.images[0];
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                  {image && (
                    <ProductImage
                      src={image.url}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm">{item.product.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Quantite : {item.quantity}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {((item.product.priceCents * item.quantity) / 100).toFixed(2)} &euro;
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{(total / 100).toFixed(2)} &euro;</span>
        </div>
      </div>
    </div>
  );
}
