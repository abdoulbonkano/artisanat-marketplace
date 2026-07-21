"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { useActionState } from "react";
import { createReviewAction } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewForm({ orderItemId, productTitle }: { orderItemId: string; productTitle: string }) {
  const [state, formAction, isPending] = useActionState(createReviewAction, undefined);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (state?.success) {
    return (
      <p className="text-sm text-primary">
        Merci, votre avis sur &laquo;&nbsp;{productTitle}&nbsp;&raquo; a ete publie.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <input type="hidden" name="orderItemId" value={orderItemId} />
      <input type="hidden" name="rating" value={rating} />
      <p className="text-sm font-medium">Noter &laquo;&nbsp;{productTitle}&nbsp;&raquo;</p>
      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} etoile${value > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(value)}
            onClick={() => setRating(value)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                value <= (hovered || rating)
                  ? "fill-accent text-accent"
                  : "fill-transparent text-muted-foreground/40",
              )}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        placeholder="Votre avis (facultatif)"
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={isPending || rating === 0} className="self-start">
        {isPending ? "Publication..." : "Publier mon avis"}
      </Button>
    </form>
  );
}
