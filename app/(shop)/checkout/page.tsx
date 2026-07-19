import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const user = await requireUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
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
    <div className="flex flex-1 flex-col gap-8 px-6 py-8 sm:flex-row">
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Livraison et paiement
        </h1>
        <CheckoutForm />
      </div>
      <div className="w-full max-w-sm shrink-0 rounded-lg border p-4">
        <h2 className="mb-4 font-medium">Recapitulatif</h2>
        <div className="flex flex-col gap-2 text-sm">
          {cart.items.map((item: (typeof cart.items)[number]) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.title} x{item.quantity}
              </span>
              <span>
                {((item.product.priceCents * item.quantity) / 100).toFixed(2)} EUR
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
          <span>Total</span>
          <span>{(total / 100).toFixed(2)} EUR</span>
        </div>
      </div>
    </div>
  );
}
