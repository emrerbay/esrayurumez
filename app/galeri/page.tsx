import type { Metadata } from "next";
import { getVisibleGalleryFilenames } from "@/src/lib/gallery";
import { GalleryGrid } from "@/src/components/GalleryGrid";
import { prisma } from "@/src/lib/db";
import { getSiteSettings } from "@/src/lib/site-settings";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Prof. Dr. Esra Yürümez galeri fotoğrafları.",
};

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  let images: { src: string; alt: string }[] = [];
  try {
    const dbImages = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true },
    });
    if (dbImages.length > 0) {
      images = dbImages.map((row) => ({
        src: `/api/gallery/image/${row.id}`,
        alt: `Galeri fotoğrafı`,
      }));
    }
  } catch {
    // DB yoksa veya hata varsa filesystem'e düşeceğiz
  }
  if (images.length === 0) {
    let hidden: string[] = [];
    try {
      const settings = await getSiteSettings();
      hidden = settings.galleryHiddenFiles ?? [];
    } catch {
      // ignore
    }
    const filenames = getVisibleGalleryFilenames(hidden);
    images = filenames.map((f) => ({
      src: `/api/gallery/image?f=${encodeURIComponent(f)}`,
      alt: `Galeri - ${f}`,
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8 text-center">
        Galeri
      </h1>
      <GalleryGrid images={images} />
    </div>
  );
}
