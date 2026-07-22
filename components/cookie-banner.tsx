"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-notice-dismissed";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable - just skip the banner
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 shadow-[0_-4px_16px_rgba(36,28,16,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Ce site utilise uniquement des cookies necessaires a son
          fonctionnement (connexion, panier), sans finalite publicitaire.{" "}
          <Link href="/confidentialite" className="underline">
            En savoir plus
          </Link>
          .
        </p>
        <Button size="sm" onClick={dismiss}>
          Compris
        </Button>
      </div>
    </div>
  );
}
