import { ShopForm } from "@/components/seller/shop-form";
import { requireShop } from "@/lib/permissions";

export default async function VendeurBoutiquePage() {
  const { shop } = await requireShop();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Ma boutique</h1>
      <ShopForm shop={shop} />
    </div>
  );
}
