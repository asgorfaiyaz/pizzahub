"use client";

import { useState } from "react";
import Image from "next/image";
import { UtensilsCrossedIcon } from "lucide-react";

import { cn } from "cn";

type MenuItemGalleryProps = {
  images: string[];
  alt: string;
};

export function MenuItemGallery({ images, alt }: MenuItemGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center rounded-xl border border-dashed bg-muted/40 text-muted-foreground">
        <UtensilsCrossedIcon className="size-10" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border bg-muted">
        <Image
          src={activeImage}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={image === activeImage}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-opacity",
                image === activeImage
                  ? "opacity-100 ring-2 ring-ring"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 1024px) 20vw, 10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
