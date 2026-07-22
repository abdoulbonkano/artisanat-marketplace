import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "md" ? "size-5" : "size-3.5";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Note : ${rating.toFixed(1)} sur 5`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden="true"
          className={cn(
            starSize,
            value <= Math.round(rating)
              ? "fill-accent text-accent"
              : "fill-transparent text-muted-foreground/40",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
