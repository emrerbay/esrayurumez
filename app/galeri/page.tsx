import type { Metadata } from "next";
import { getGalleryFilenames } from "@/src/lib/gallery";
import { GalleryGrid } from "@/src/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Prof. Dr. Esra Yürümez galeri fotoğrafları.",
};

export const dynamic = "force-dynamic";

export default function GaleriPage() {
  const filenames = getGalleryFilenames();
  const images = filenames.map((f) => ({
    src: `/api/gallery/image?f=${encodeURIComponent(f)}`,
    alt: `Galeri - ${f}`,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8 text-center">
        Galeri
      </h1>
      <GalleryGrid images={images} />
    </div>
  );
}
