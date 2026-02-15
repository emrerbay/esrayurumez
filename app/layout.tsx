import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { getSiteSettings } from "@/src/lib/site-settings";

/** Tüm sayfalar istek anında render edilsin; build sırasında DB/network gerekmez */
export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL ?? "https://esrayurumez.com.tr";

// Next.js Metadata: metadataBase, openGraph.url/siteName/images runtime'da kullanılır
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prof. Dr. Esra Yürümez | Çocuk ve Ergen Psikiyatrisi",
    template: "%s | Prof. Dr. Esra Yürümez",
  },
  description:
    "Çocuk ve ergen ruh sağlığı alanında bilimsel, empatik ve güvenilir destek. Prof. Dr. Esra Yürümez ile tanışın.",
  keywords: ["çocuk psikiyatrisi", "ergen psikiyatrisi", "Esra Yürümez", "ruh sağlığı"],
  authors: [{ name: "Prof. Dr. Esra Yürümez" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Prof. Dr. Esra Yürümez",
    images: [{ url: "/logo/logo.ico", width: 32, height: 32, alt: "Prof. Dr. Esra Yürümez" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prof. Dr. Esra Yürümez | Çocuk ve Ergen Psikiyatrisi",
    description: "Çocuk ve ergen ruh sağlığı alanında bilimsel, empatik ve güvenilir destek.",
  },
} as Metadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    // DB yoksa Footer varsayılanlarla çalışır
  }
  return (
    <html lang="tr" className="font-body" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/logo.ico" type="image/x-icon" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
