"use client";

import { deleteProductAdminAction, unpublishProductAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ProductModerationActions({
  productId,
  status,
}: {
  productId: string;
  status: string;
}) {
  const boundUnpublish = unpublishProductAction.bind(null, productId);
  const boundDelete = deleteProductAdminAction.bind(null, productId);

  return (
    <div className="flex gap-2">
      {status !== "ARCHIVED" && (
        <form action={boundUnpublish}>
          <Button type="submit" variant="outline" size="sm">
            Depublier
          </Button>
        </form>
      )}
      <form
        action={boundDelete}
        onSubmit={(event) => {
          if (!confirm("Supprimer definitivement ce produit ?")) {
            event.preventDefault();
          }
        }}
      >
        <Button type="submit" variant="destructive" size="sm">
          Supprimer
        </Button>
      </form>
    </div>
  );
}
