"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmEmailVerificationAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VerifyEmailForm({ token }: { token?: string }) {
  const [state, formAction, isPending] = useActionState(confirmEmailVerificationAction, undefined);

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ce lien de verification est incomplet. Reconnectez-vous et
              demandez un nouvel email de confirmation depuis votre compte.
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
          <CardTitle>Confirmer votre email</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <p className="text-sm text-muted-foreground">
              Votre adresse email est confirmee. Merci !{" "}
              <Link href="/" className="underline">
                Retour a l&apos;accueil
              </Link>
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Cliquez sur le bouton ci-dessous pour confirmer que cette
                adresse email vous appartient.
              </p>
              <form action={formAction}>
                <input type="hidden" name="token" value={token} />
                {state?.error && (
                  <p className="mb-3 text-sm text-destructive">{state.error}</p>
                )}
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Verification..." : "Confirmer mon email"}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
