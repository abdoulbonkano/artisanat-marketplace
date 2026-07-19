import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Paiement annule</h1>
      <p className="text-sm text-muted-foreground">
        Votre commande n&apos;a pas ete payee. Votre panier est toujours disponible.
      </p>
      <Button render={<Link href="/panier" />} nativeButton={false}>
        Retour au panier
      </Button>
    </div>
  );
}
