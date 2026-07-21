"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleWishlistAction } from "@/actions/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  initialWishlisted,
  className,
}: {
  productId: string;
  initialWishlisted: boolean;
  className?: string;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={wishlisted}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setWishlisted((current) => !current);
        startTransition(async () => {
          await toggleWishlistAction(productId);
        });
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-60",
        className,
      )}
    >
      <Heart
        className={cn("size-4", wishlisted ? "fill-destructive text-destructive" : "text-foreground")}
        strokeWidth={1.75}
      />
    </button>
  );
}
