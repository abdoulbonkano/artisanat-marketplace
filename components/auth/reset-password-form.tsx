"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined);

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ce lien de reinitialisation est incomplet. Demandez-en un
              nouveau depuis la page{" "}
              <Link href="/auth/mot-de-passe-oublie" className="underline">
                mot de passe oublie
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Choisir un nouveau mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <p className="text-sm text-muted-foreground">
              Votre mot de passe a ete mis a jour.{" "}
              <Link href="/auth/connexion" className="underline">
                Se connecter
              </Link>
            </p>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="token" value={token} />
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>
              {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
