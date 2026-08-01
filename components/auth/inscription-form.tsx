"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InscriptionForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, undefined);

  return (
    <AuthShell>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Creer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creation..." : "Creer mon compte"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Deja un compte ?{" "}
            <Link href="/auth/connexion" className="underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
