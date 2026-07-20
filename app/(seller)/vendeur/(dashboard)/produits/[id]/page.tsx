import { notFound } from "next/navigation";
import { deleteProductAction, updateProductAction } from "@/actions/products";
import { DeleteProductButton } from "@/components/seller/delete-product-button";
import { ProductForm } from "@/components/seller/product-form";
import { ProductImages } from "@/components/seller/product-images";
import { requireShop } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function EditProduitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { shop } = await requireShop();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product || product.shopId !== shop.id) {
    notFound();
  }

  const boundUpdate = updateProductAction.bind(null, product.id);
  const boundDelete = deleteProductAction.bind(null, product.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Modifier {product.title}
        </h1>
        <DeleteProductButton action={boundDelete} />
      </div>
      <ProductForm
        action={boundUpdate}
        categories={categories}
        product={product}
        submitLabel="Enregistrer"
      />
      <ProductImages productId={product.id} images={product.images} />
    </div>
  );
}
