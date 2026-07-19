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

  return status === "SUSPENDED" ? (
    <form action={boundActivate}>
      <Button type="submit" size="sm">
        Reactiver
      </Button>
    </form>
  ) : (
    <form action={boundSuspend}>
      <Button type="submit" variant="destructive" size="sm">
        Suspendre
      </Button>
    </form>
  );
}
