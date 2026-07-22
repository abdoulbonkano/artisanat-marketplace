"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: { id: string; url: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const current = images[selected];

  if (!current) {
    return <div className="aspect-square w-full rounded-3xl bg-muted" />;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group/zoom relative aspect-square w-full overflow-hidden rounded-3xl bg-muted shadow-[0_4px_8px_-4px_rgba(36,28,16,0.08),0_20px_36px_-16px_rgba(36,28,16,0.2)]"
        >
          <Image
            src={current.url}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />
          <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm opacity-0 transition-opacity group-hover/zoom:opacity-100">
            <ZoomIn className="size-4" strokeWidth={1.75} />
          </span>
        </button>
        {images.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  "relative size-20 overflow-hidden rounded-lg border-2 transition-colors",
                  index === selected ? "border-accent" : "border-transparent",
                )}
              >
                <Image
                  src={image.url}
                  alt={`${title} - photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/85 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none">
            <Dialog.Title className="sr-only">Photo agrandie de {title}</Dialog.Title>
            <Dialog.Close
              aria-label="Fermer"
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </Dialog.Close>
            <div className="relative h-full w-full max-w-4xl">
              <Image
                src={current.url}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelected(index)}
                    className="flex size-6 items-center justify-center"
                    aria-label={`Photo ${index + 1}`}
                    aria-current={index === selected}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        index === selected ? "bg-white" : "bg-white/40",
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
