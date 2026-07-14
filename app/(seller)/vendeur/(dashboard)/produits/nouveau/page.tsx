import { createProductAction } from "@/actions/products";
import { ProductForm } from "@/components/seller/product-form";
import { prisma } from "@/lib/prisma";

export default async function NouveauProduitPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nouveau produit</h1>
      <ProductForm
        action={createProductAction}
        categories={categories}
        submitLabel="Creer le produit"
      />
    </div>
  );
}
