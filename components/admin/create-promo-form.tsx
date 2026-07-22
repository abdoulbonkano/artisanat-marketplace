"use client";

import { useActionState } from "react";
import { createPromoCodeAction } from "@/actions/promo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const typeLabel: Record<string, string> = {
  PERCENTAGE: "Pourcentage",
  FIXED: "Montant fixe (EUR)",
};

export function CreatePromoForm() {
  const [state, formAction, isPending] = useActionState(createPromoCodeAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="code" className="text-xs">
          Code
        </Label>
        <Input id="code" name="code" placeholder="BIENVENUE10" className="w-40" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="type" className="text-xs">
          Type
        </Label>
        <Select name="type" defaultValue="PERCENTAGE">
          <SelectTrigger id="type" className="w-40">
            <SelectValue>{(value: string) => typeLabel[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
            <SelectItem value="FIXED">Montant fixe (EUR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="value" className="text-xs">
          Valeur
        </Label>
        <Input id="value" name="value" type="number" min="1" className="w-24" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="maxUses" className="text-xs">
          Utilisations max
        </Label>
        <Input id="maxUses" name="maxUses" type="number" min="1" className="w-32" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="expiresAt" className="text-xs">
          Expire le
        </Label>
        <Input id="expiresAt" name="expiresAt" type="date" className="w-40" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creation..." : "Creer le code"}
      </Button>
      {state?.error && <p className="w-full text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
