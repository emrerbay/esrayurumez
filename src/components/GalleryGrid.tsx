"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox, type LightboxImage } from "./Lightbox";

interface ImageItem {
  src: string;
  alt: string;
}

export function GalleryGrid({ images }: { images: ImageItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="text-center text-text-main/70 py-12">
        Henüz fotoğraf eklenmemiştir.
      </p>
    );
  }

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className="relative aspect-square rounded-xl overflow-hidden bg-bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              unoptimized
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
