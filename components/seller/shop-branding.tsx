"use client";

import { ImagePlus, Store } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import {
  removeShopBannerAction,
  removeShopLogoAction,
  updateShopBannerAction,
  updateShopLogoAction,
} from "@/actions/shops";
import { Button } from "@/components/ui/button";

export function ShopBranding({
  logoUrl,
  bannerUrl,
}: {
  logoUrl: string | null;
  bannerUrl: string | null;
}) {
  const [bannerState, bannerAction, bannerPending] = useActionState(
    updateShopBannerAction,
    undefined,
  );
  const [logoState, logoAction, logoPending] = useActionState(
    updateShopLogoAction,
    undefined,
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Identite visuelle</p>

      <div className="relative">
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-secondary/50">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt="Banniere de la boutique"
              fill
              className="object-cover"
              sizes="600px"
            />
          ) : (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="size-4" strokeWidth={1.75} />
              Pas encore de banniere
            </div>
          )}
        </div>
        <div className="absolute -bottom-8 left-6 flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-secondary/70 shadow-md">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo de la boutique"
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <Store className="size-7 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Banniere (format large, ex. 1200x400)
          </p>
          <form action={bannerAction} className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-xs"
            />
            <Button type="submit" size="sm" disabled={bannerPending}>
              {bannerPending ? "..." : "Changer"}
            </Button>
            {bannerUrl && (
              <Button
                type="submit"
                formAction={removeShopBannerAction}
                formNoValidate
                variant="destructive"
                size="sm"
              >
                Retirer
              </Button>
            )}
          </form>
          {bannerState?.error && (
            <p className="text-xs text-destructive">{bannerState.error}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Logo (carre, min. 200x200)</p>
          <form action={logoAction} className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-xs"
            />
            <Button type="submit" size="sm" disabled={logoPending}>
              {logoPending ? "..." : "Changer"}
            </Button>
            {logoUrl && (
              <Button
                type="submit"
                formAction={removeShopLogoAction}
                formNoValidate
                variant="destructive"
                size="sm"
              >
                Retirer
              </Button>
            )}
          </form>
          {logoState?.error && (
            <p className="text-xs text-destructive">{logoState.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
