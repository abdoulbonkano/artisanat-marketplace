"use client";

import { Button } from "@/components/ui/button";

export function DeleteProductButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
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
  );
}
