"use client";

import { useState } from "react";

import { ProjectCover } from "@/components/public/projects/project-cover";
import { Card } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import { TProjectImage } from "@/types/portfolio";

type TProjectGalleryProps = {
  images: TProjectImage[];
  projectName: string;
  techStack?: string[];
};

export function ProjectGallery({ images, projectName, techStack = [] }: TProjectGalleryProps) {
  const [activeImageId, setActiveImageId] = useState(images[0]?.id ?? null);

  const cover = (
    <ProjectCover name={projectName} techStack={techStack} seed={projectName.length} className="min-h-full" />
  );

  // No screenshots yet: show a designed cover rather than an apology.
  if (!images.length) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-video">{cover}</div>
      </Card>
    );
  }

  const previewImage = images.find((image) => image.id === activeImageId) ?? images[0];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-(--color-accent)/10">
          <SafeImage
            key={previewImage.id}
            src={previewImage.url}
            alt={previewImage.altText || projectName}
            loading="eager"
            maxWidth={1600}
            fallback={cover}
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
                onClick={() => setActiveImageId(image.id)}
                aria-pressed={isActive}
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

                <SafeImage
                  src={image.url}
                  alt={image.altText || projectName}
                  maxWidth={480}
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
