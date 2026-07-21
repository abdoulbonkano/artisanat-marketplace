"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmation">
          Tapez <span className="font-mono font-semibold">SUPPRIMER</span> pour confirmer
        </Label>
        <Input id="confirmation" name="confirmation" required autoComplete="off" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="destructive" disabled={isPending}>
        {isPending ? "Suppression..." : "Supprimer definitivement mon compte"}
      </Button>
    </form>
  );
}
