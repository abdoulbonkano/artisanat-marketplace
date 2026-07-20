"use client";

import { activateShopAction, suspendShopAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ShopStatusActions({
  shopId,
  status,
}: {
  shopId: string;
  status: string;
}) {
  const boundSuspend = suspendShopAction.bind(null, shopId);
  const boundActivate = activateShopAction.bind(null, shopId);

  if (status === "ACTIVE") {
    return (
      <form action={boundSuspend}>
        <Button type="submit" variant="destructive" size="sm">
          Suspendre
        </Button>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <form action={boundActivate}>
        <Button type="submit" size="sm">
          {status === "PENDING" ? "Approuver" : "Reactiver"}
        </Button>
      </form>
      {status === "PENDING" && (
        <form action={boundSuspend}>
          <Button type="submit" variant="destructive" size="sm">
            Refuser
          </Button>
        </form>
      )}
    </div>
  );
}
