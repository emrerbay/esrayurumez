import path from "path";
import fs from "fs";

const PHOTOS_DIR = path.join(process.cwd(), "esrayurumez-files", "photos");

export function getGalleryImagePaths(): string[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];
  const files = fs.readdirSync(PHOTOS_DIR);
  return files
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    })
    .map((f) => `/api/gallery/image?f=${encodeURIComponent(f)}`);
}

/**
 * Returns the filesystem path for a photo filename (for serving or next/image).
 * Use route handler to serve from esrayurumez-files.
 */
export function getPhotoFsPath(filename: string): string | null {
  const sanitized = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "");
  const full = path.join(PHOTOS_DIR, sanitized);
  if (!fs.existsSync(full)) return null;
  return full;
}

export function getGalleryFilenames(): string[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];
  const files = fs.readdirSync(PHOTOS_DIR);
  return files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });
}

/** Görünür klasör görselleri (gizli listesi dışında) */
export function getVisibleGalleryFilenames(hiddenFilenames: string[]): string[] {
  const hidden = new Set(hiddenFilenames.map((f) => f.trim().toLowerCase()));
  return getGalleryFilenames().filter((f) => !hidden.has(f.toLowerCase()));
}
