"use client";

import Image from "next/image";
import { useState } from "react";
import { buildImageUrl, type GalleryFile } from "@/lib/gallery";

type GalleryGridProps = {
  items: GalleryFile[];
  title?: string;
  collapsible?: boolean;
};

export function GalleryGrid({ items, title, collapsible = false }: GalleryGridProps) {
  const [expanded, setExpanded] = useState(!collapsible);

  if (!items.length) {
    return null;
  }

  return (
    <section suppressHydrationWarning className="space-y-6">
      {title && (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-sm text-stone-300 transition hover:text-white"
            >
              {expanded ? "Ocultar" : "Mostrar"}
            </button>
          )}
        </div>
      )}

      {expanded && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-[1.5rem] border border-stone-800 bg-stone-900">
              <div className="block w-full overflow-hidden">
                <div className="relative h-[260px] w-full">
                  <Image
                    src={buildImageUrl(item.url, 500)}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-stone-800 p-3">
                <span className="truncate text-sm text-stone-300">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
