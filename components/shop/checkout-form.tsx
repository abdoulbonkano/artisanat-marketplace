"use client";

import { useActionState } from "react";
import { createCheckoutSessionAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm() {
  const [state, formAction, isPending] = useActionState(
    createCheckoutSessionAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingName">Nom complet</Label>
        <Input id="shippingName" name="shippingName" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingAddress">Adresse</Label>
        <Input id="shippingAddress" name="shippingAddress" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="shippingPostalCode">Code postal</Label>
          <Input id="shippingPostalCode" name="shippingPostalCode" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="shippingCity">Ville</Label>
          <Input id="shippingCity" name="shippingCity" required />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingCountry">Pays</Label>
        <Input id="shippingCountry" name="shippingCountry" defaultValue="FR" required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Redirection vers le paiement..." : "Payer maintenant"}
      </Button>
    </form>
  );
}
