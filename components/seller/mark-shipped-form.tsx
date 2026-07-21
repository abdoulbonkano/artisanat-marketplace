"use client";

import { useActionState } from "react";
import { markShipmentShippedAction } from "@/actions/fulfillment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MarkShippedForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(markShipmentShippedAction, undefined);

  if (state?.success) {
    return <p className="text-sm text-primary">Expedition enregistree.</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="flex flex-col gap-1">
        <Label htmlFor={`carrier-${orderId}`} className="text-xs">
          Transporteur
        </Label>
        <Input id={`carrier-${orderId}`} name="carrier" className="h-8 w-32" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`tracking-${orderId}`} className="text-xs">
          N&deg; de suivi
        </Label>
        <Input id={`tracking-${orderId}`} name="trackingNumber" className="h-8 w-40" required />
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "..." : "Marquer expediee"}
      </Button>
      {state?.error && <p className="w-full text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
