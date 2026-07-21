import Link from "next/link";
import { ShopBranding } from "@/components/seller/shop-branding";
import { ShopForm } from "@/components/seller/shop-form";
import { requireShop } from "@/lib/permissions";

export default async function VendeurBoutiquePage() {
  const { shop } = await requireShop();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Ma boutique</h1>
        {shop.status === "ACTIVE" && (
          <Link
            href={`/boutiques/${shop.slug}`}
            className="text-sm text-accent underline decoration-accent/40 underline-offset-4 hover:text-foreground"
          >
            Voir ma boutique publique &rarr;
          </Link>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card px-6 py-8 sm:px-8">
        <ShopBranding logoUrl={shop.logoUrl} bannerUrl={shop.bannerUrl} />
      </div>

      <div className="rounded-3xl border border-border bg-card px-6 py-8 sm:px-8">
        <ShopForm shop={shop} />
      </div>
    </div>
  );
}
