"use client";

import { useActionState } from "react";
import { requestReturnAction } from "@/actions/fulfillment";
import { Button } from "@/components/ui/button";

export function ReturnRequestForm({ orderItemId, productTitle }: { orderItemId: string; productTitle: string }) {
  const [state, formAction, isPending] = useActionState(requestReturnAction, undefined);

  if (state?.success) {
    return (
      <p className="text-sm text-muted-foreground">
        Demande de retour envoyee pour &laquo;&nbsp;{productTitle}&nbsp;&raquo;.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <input type="hidden" name="orderItemId" value={orderItemId} />
      <p className="text-sm font-medium">Demander un retour - {productTitle}</p>
      <textarea
        name="reason"
        rows={2}
        placeholder="Expliquez la raison du retour"
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" variant="outline" disabled={isPending} className="self-start">
        {isPending ? "Envoi..." : "Envoyer la demande"}
      </Button>
    </form>
  );
}
