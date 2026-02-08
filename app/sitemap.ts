import { prisma } from "@/src/lib/db";

const BASE = process.env.SITE_URL ?? "https://esrayurumez.com";

type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export default async function sitemap(): Promise<SitemapEntry[]> {
  const staticPages: SitemapEntry[] = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/hakkimda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/bilimsel-calismalar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/galeri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/kullanim-sartlari`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let blogPages: SitemapEntry[] = [];
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Veritabanı erişilemezse sadece statik sayfalar
  }

  return [...staticPages, ...blogPages];
}
