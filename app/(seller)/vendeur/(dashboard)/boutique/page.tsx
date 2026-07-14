import { ShopForm } from "@/components/seller/shop-form";
import { requireSeller } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendeurBoutiquePage() {
  const user = await requireSeller();
  const shop = await prisma.shop.findUniqueOrThrow({ where: { ownerId: user.id } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Ma boutique</h1>
      <ShopForm shop={shop} />
    </div>
  );
}
