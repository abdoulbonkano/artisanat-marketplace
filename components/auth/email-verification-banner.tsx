"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";
import { resendVerificationEmailAction } from "@/actions/auth";

export function EmailVerificationBanner() {
  const [state, formAction, isPending] = useActionState(resendVerificationEmailAction, undefined);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border/70 bg-secondary/40 px-4 py-2 text-center text-sm">
      <Mail className="size-4 shrink-0 text-muted-foreground" />
      <span>Confirmez votre adresse email pour securiser votre compte.</span>
      {state?.success ? (
        <span className="font-medium text-primary">Email envoye, verifiez votre boite de reception.</span>
      ) : (
        <form action={formAction}>
          <button type="submit" disabled={isPending} className="font-medium underline disabled:opacity-60">
            {isPending ? "Envoi..." : "Renvoyer l'email"}
          </button>
        </form>
      )}
    </div>
  );
}
