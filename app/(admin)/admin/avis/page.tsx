import { MessageSquareText } from "lucide-react";
import { hideReviewAction, unhideReviewAction } from "@/actions/reviews";
import { StarRating } from "@/components/reviews/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

export default async function AdminAvisPage() {
  const reviews = await prisma.review.findMany({
    include: { author: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Avis clients</h1>

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="Aucun avis pour le moment"
          description="Les avis laisses par les acheteurs sur leurs commandes apparaitront ici."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review: (typeof reviews)[number]) => (
            <div
              key={review.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{review.product.title}</p>
                  <span className="text-sm text-muted-foreground">par {review.author.name}</span>
                  <StarRating rating={review.rating} />
                  {review.hiddenAt && <Badge variant="destructive">Masque</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {review.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                  {review.hiddenAt ? (
                    <form action={unhideReviewAction.bind(null, review.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        Republier
                      </Button>
                    </form>
                  ) : (
                    <form action={hideReviewAction.bind(null, review.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        Masquer
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
