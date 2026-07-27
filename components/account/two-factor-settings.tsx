"use client";

import { useActionState, useState } from "react";
import {
  confirmTwoFactorSetupAction,
  disableTwoFactorAction,
  startTwoFactorSetupAction,
} from "@/actions/two-factor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TwoFactorSettings({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [startPending, setStartPending] = useState(false);
  const [confirmState, confirmAction, confirmPending] = useActionState(
    async (
      prevState: Awaited<ReturnType<typeof confirmTwoFactorSetupAction>>,
      formData: FormData,
    ) => {
      const result = await confirmTwoFactorSetupAction(prevState, formData);
      if (result && "success" in result) {
        setRecoveryCodes(result.recoveryCodes);
        setSetup(null);
      }
      return result;
    },
    undefined,
  );
  const [disableState, disableAction, disablePending] = useActionState(
    disableTwoFactorAction,
    undefined,
  );

  async function handleStart() {
    setStartPending(true);
    const result = await startTwoFactorSetupAction();
    setSetup(result);
    setStartPending(false);
  }

  if (recoveryCodes) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-primary">
          Authentification a deux facteurs activee.
        </p>
        <p className="text-sm text-muted-foreground">
          Conservez ces codes de secours dans un endroit sur. Chacun ne peut
          etre utilise qu&apos;une seule fois, si vous perdez l&apos;acces a
          votre application d&apos;authentification.
        </p>
        <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/40 p-4 font-mono text-sm">
          {recoveryCodes.map((code) => (
            <span key={code}>{code}</span>
          ))}
        </div>
        <Button size="sm" className="self-start" onClick={() => setRecoveryCodes(null)}>
          J&apos;ai enregistre mes codes
        </Button>
      </div>
    );
  }

  if (setup) {
    return (
      <form action={confirmAction} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Scannez ce QR code avec votre application d&apos;authentification
          (Google Authenticator, Authy...), ou saisissez la cle manuellement.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element -- small local data: URI QR code, next/image adds no value here */}
        <img
          src={setup.qrCodeDataUrl}
          alt="QR code de configuration de l'authentification a deux facteurs"
          width={200}
          height={200}
          className="self-start rounded-md border border-border"
        />
        <p className="font-mono text-xs break-all text-muted-foreground">{setup.secret}</p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code a 6 chiffres</Label>
          <Input id="code" name="code" inputMode="numeric" autoFocus maxLength={6} />
        </div>
        {confirmState && "error" in confirmState && (
          <p className="text-sm text-destructive">{confirmState.error}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={confirmPending}>
            {confirmPending ? "Verification..." : "Confirmer"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSetup(null)}>
            Annuler
          </Button>
        </div>
      </form>
    );
  }

  if (enabled) {
    return (
      <form action={disableAction} className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          L&apos;authentification a deux facteurs est activee sur ce compte.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disable-password">Mot de passe</Label>
          <Input id="disable-password" name="password" type="password" required />
        </div>
        {disableState?.error && (
          <p className="text-sm text-destructive">{disableState.error}</p>
        )}
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="self-start border-destructive/30 text-destructive hover:bg-destructive/5"
          disabled={disablePending}
        >
          {disablePending ? "Desactivation..." : "Desactiver la 2FA"}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Ajoutez une couche de securite supplementaire : en plus de votre mot
        de passe, un code genere par une application d&apos;authentification
        sera demande a chaque connexion.
      </p>
      <Button size="sm" className="self-start" onClick={handleStart} disabled={startPending}>
        {startPending ? "Preparation..." : "Activer la 2FA"}
      </Button>
    </div>
  );
}
