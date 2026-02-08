import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { getSiteSettings } from "@/src/lib/site-settings";

/** Tüm sayfalar istek anında render edilsin; build sırasında DB/network gerekmez */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
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
  },
};

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
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
