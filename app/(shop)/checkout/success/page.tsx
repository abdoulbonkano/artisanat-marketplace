import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await requireUser();
  const { session_id } = await searchParams;

  const order = session_id
    ? await prisma.order.findFirst({
        where: { stripeCheckoutSessionId: session_id, buyerId: user.id },
      })
    : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Merci pour votre commande !</h1>
      {order ? (
        <p className="text-sm text-muted-foreground">
          {order.status === "PAID"
            ? "Votre paiement a bien ete confirme."
            : "Votre paiement est en cours de confirmation, cela ne prend que quelques instants."}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Votre paiement est en cours de traitement.
        </p>
      )}
      <div className="flex gap-3">
        {order && (
          <Button render={<Link href={`/commandes/${order.id}`} />} nativeButton={false}>
            Voir ma commande
          </Button>
        )}
        <Button
          render={<Link href="/produits" />}
          nativeButton={false}
          variant="outline"
        >
          Continuer mes achats
        </Button>
      </div>
    </div>
  );
}
