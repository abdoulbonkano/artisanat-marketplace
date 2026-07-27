import {
  addProductImageAction,
  removeProductImageAction,
} from "@/actions/products";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";

export function ProductImages({
  productId,
  images,
}: {
  productId: string;
  images: { id: string; url: string }[];
}) {
  const boundAdd = addProductImageAction.bind(null, productId);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Photos</h2>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((image) => {
            const boundRemove = removeProductImageAction.bind(
              null,
              productId,
              image.id,
            );
            return (
              <div key={image.id} className="flex flex-col gap-2">
                <div className="relative size-32 overflow-hidden rounded-md border">
                  <ProductImage
                    src={image.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <form action={boundRemove}>
                  <Button type="submit" variant="destructive" size="sm">
                    Supprimer
                  </Button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <form action={boundAdd} className="flex items-center gap-3">
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-sm"
        />
        <Button type="submit" size="sm">
          Ajouter la photo
        </Button>
      </form>
    </div>
  );
}
