import { Tag } from "lucide-react";
import { togglePromoCodeAction } from "@/actions/promo";
import { CreatePromoForm } from "@/components/admin/create-promo-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

export default async function AdminPromosPage() {
  const promoCodes = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Codes promo</h1>

      <Card>
        <CardHeader>
          <CardTitle>Creer un code</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePromoForm />
        </CardContent>
      </Card>

      {promoCodes.length === 0 ? (
        <EmptyState icon={Tag} title="Aucun code promo pour le moment" />
      ) : (
        <div className="flex flex-col gap-3">
          {promoCodes.map((promo: (typeof promoCodes)[number]) => (
            <div
              key={promo.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-medium">{promo.code}</span>
                <Badge variant="secondary">
                  {promo.type === "PERCENTAGE"
                    ? `-${promo.value}%`
                    : `-${(promo.value / 100).toFixed(2)} €`}
                </Badge>
                <Badge variant={promo.active ? "secondary" : "destructive"}>
                  {promo.active ? "Actif" : "Desactive"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {promo.usedCount} utilisation{promo.usedCount > 1 ? "s" : ""}
                  {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                </span>
                {promo.expiresAt && (
                  <span className="text-sm text-muted-foreground">
                    Expire le {promo.expiresAt.toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              <form action={togglePromoCodeAction.bind(null, promo.id)}>
                <Button type="submit" variant="outline" size="sm">
                  {promo.active ? "Desactiver" : "Reactiver"}
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
