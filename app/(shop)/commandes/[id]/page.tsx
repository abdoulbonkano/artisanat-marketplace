import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";
import { StarRating } from "@/components/reviews/star-rating";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "En attente de paiement",
  PAID: "Payee",
  FULFILLED: "Expediee",
  CANCELLED: "Annulee",
  REFUNDED: "Remboursee",
};

export default async function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { review: true } } },
  });

  if (!order || order.buyerId !== user.id) {
    notFound();
  }

  const canReview = order.status === "PAID" || order.status === "FULFILLED";

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Commande du {order.createdAt.toLocaleDateString("fr-FR")}
        </h1>
        <Badge variant="secondary">{statusLabel[order.status]}</Badge>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">Livraison</h2>
        <p className="text-sm text-muted-foreground">
          {order.shippingName}
          <br />
          {order.shippingAddress}
          <br />
          {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {order.items.map((item: (typeof order.items)[number]) => (
          <div key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>
              {item.titleSnapshot} x{item.quantity}
            </span>
            <span>
              {((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{(order.totalCents / 100).toFixed(2)} EUR</span>
      </div>

      {canReview && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium">Vos avis</h2>
          {order.items
            .filter((item: (typeof order.items)[number]) => item.productId)
            .map((item: (typeof order.items)[number]) =>
              item.review ? (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">{item.titleSnapshot}</p>
                  <StarRating rating={item.review.rating} className="mt-1" />
                  {item.review.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{item.review.comment}</p>
                  )}
                </div>
              ) : (
                <ReviewForm key={item.id} orderItemId={item.id} productTitle={item.titleSnapshot} />
              ),
            )}
        </div>
      )}
    </div>
  );
}
