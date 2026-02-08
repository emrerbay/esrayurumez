/**
 * Slugify string with Turkish character support.
 * ş->s, ğ->g, ü->u, ö->o, ç->c, ı->i, İ->i
 */
const trMap: Record<string, string> = {
  ş: "s", Ş: "s", ğ: "g", Ğ: "g", ü: "u", Ü: "u",
  ö: "o", Ö: "o", ç: "c", Ç: "c", ı: "i", İ: "i",
};

export function slugify(text: string): string {
  let s = text.trim();
  for (const [tr, en] of Object.entries(trMap)) {
    s = s.split(tr).join(en);
  }
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Slug from filename: "Bebeklikte Uyku Sorunları.docx" -> "bebeklikte-uyku-sorunlari"
 */
export function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.(docx|doc|pages)$/i, "").trim();
  return slugify(base);
}
