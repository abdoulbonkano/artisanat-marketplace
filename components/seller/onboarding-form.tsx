"use client";

import { useActionState } from "react";
import { createShopAction } from "@/actions/shops";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createShopAction, undefined);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Devenir vendeur</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cette marketplace est reservee aux artisans et vendeurs
            professionnels. Votre demande sera examinee manuellement avant
            que votre boutique ne devienne visible.
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom de la boutique</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Votre activite d&apos;artisan</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="D'ou viennent vos creations, comment sont-elles faconnees, depuis quand exercez-vous..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="siret">Numero SIRET</Label>
              <Input
                id="siret"
                name="siret"
                required
                inputMode="numeric"
                placeholder="14 chiffres"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telephone de contact</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Envoi..." : "Envoyer ma demande"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
