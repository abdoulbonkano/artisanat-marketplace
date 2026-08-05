"use client";

import { useActionState } from "react";
import { updateShopAction } from "@/actions/shops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ShopForm({
  shop,
}: {
  shop: {
    name: string;
    description: string | null;
    siret: string | null;
    phone: string | null;
    shippingPriceCents: number | null;
    shippingInfo: string | null;
  };
}) {
  const [state, formAction, isPending] = useActionState(updateShopAction, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nom de la boutique</Label>
        <Input id="name" name="name" required defaultValue={shop.name} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Votre activite d&apos;artisan</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          required
          defaultValue={shop.description ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="siret">Numero SIRET</Label>
        <Input
          id="siret"
          name="siret"
          required
          inputMode="numeric"
          defaultValue={shop.siret ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telephone de contact</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={shop.phone ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingPrice">Frais de livraison (EUR)</Label>
        <Input
          id="shippingPrice"
          name="shippingPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="Laisser vide si non communique"
          defaultValue={
            shop.shippingPriceCents !== null ? (shop.shippingPriceCents / 100).toFixed(2) : ""
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="shippingInfo">Delai de livraison indicatif</Label>
        <Input
          id="shippingInfo"
          name="shippingInfo"
          placeholder="Ex : Expedie sous 3 a 5 jours ouvres"
          maxLength={200}
          defaultValue={shop.shippingInfo ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
