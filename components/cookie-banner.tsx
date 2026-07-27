"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-notice-dismissed";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export function CookieBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    listeners.forEach((listener) => listener());
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
