const BASE = process.env.SITE_URL ?? "https://esrayurumez.com.tr";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
