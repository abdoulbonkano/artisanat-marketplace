"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, undefined);

  return (
    <AuthShell>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mot de passe oublie</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <p className="text-sm text-muted-foreground">
              Si un compte existe avec cette adresse, un email contenant un
              lien de reinitialisation vient de vous etre envoye. Pensez a
              verifier vos spams.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Indiquez votre adresse email, nous vous enverrons un lien pour
                choisir un nouveau mot de passe.
              </p>
              <form action={formAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Envoi..." : "Envoyer le lien"}
                </Button>
              </form>
            </>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/auth/connexion" className="underline">
              Retour a la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
