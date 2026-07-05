"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TProjectImage } from "@/types/portfolio";

type TProjectGalleryProps = {
  images: TProjectImage[];
  projectName: string;
};

export function ProjectGallery({ images, projectName }: TProjectGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || null);

  if (!images.length) {
    return (
      <Card className="overflow-hidden">
        <div className="flex aspect-video items-center justify-center bg-(--color-accent)/10 p-8 text-center">
          <div>
            <ImageIcon className="mx-auto text-accent" size={42} />
            <p className="mt-4 text-lg font-semibold text-highlight">
              Project Preview Coming Soon
            </p>
            <p className="mt-2 text-sm text-normal">
              Upload project screenshots from the admin dashboard.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const previewImage = activeImage || images[0];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-(--color-accent)/10">
          <img
            src={previewImage.url}
            alt={previewImage.altText || projectName}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </Card>

      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {images.map((image) => {
            const isActive = previewImage.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImage(image)}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card transition",
                  isActive
                    ? "border-(--color-accent)"
                    : "border-site hover:border-(--color-accent)",
                )}
              >
                <span className="sr-only">
                  Show {image.altText || projectName}
                </span>

                <img
                  src={image.url}
                  alt={image.altText || projectName}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
