"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signInAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ConnexionForm() {
  const [state, formAction, isPending] = useActionState(signInAction, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const requiresTwoFactor = state?.requiresTwoFactor ?? false;

  return (
    <AuthShell>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                readOnly={requiresTwoFactor}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/auth/mot-de-passe-oublie"
                  className="text-xs text-muted-foreground underline"
                >
                  Oublie ?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                readOnly={requiresTwoFactor}
              />
            </div>
            {requiresTwoFactor && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="totpCode">Code de verification</Label>
                <Input
                  id="totpCode"
                  name="totpCode"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456 ou code de secours"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Entrez le code a 6 chiffres de votre application
                  d&apos;authentification, ou l&apos;un de vos codes de secours.
                </p>
              </div>
            )}
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Connexion..."
                : requiresTwoFactor
                  ? "Verifier le code"
                  : "Se connecter"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/auth/inscription" className="underline">
              Creer un compte
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
