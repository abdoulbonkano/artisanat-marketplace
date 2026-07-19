"use client";

import { useState } from "react";
import { addToCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddToCartForm({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [pending, setPending] = useState(false);
  const boundAdd = addToCartAction.bind(null, productId);

  if (stock <= 0) {
    return null;
  }

  return (
    <form
      action={async (formData) => {
        setPending(true);
        await boundAdd(formData);
        setPending(false);
      }}
      className="flex items-center gap-3"
    >
      <Input
        type="number"
        name="quantity"
        defaultValue={1}
        min={1}
        max={stock}
        className="w-20"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter au panier"}
      </Button>
    </form>
  );
}
