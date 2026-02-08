import type { Metadata } from "next";
import { getBilimselCalismalarHtml } from "@/src/lib/cv-extract";

export const metadata: Metadata = {
  title: "Bilimsel Çalışmalar",
  description: "Prof. Dr. Esra Yürümez bilimsel çalışmalar ve yayınlar.",
};

export const dynamic = "force-dynamic";

export default async function BilimselCalismalarPage() {
  let html: string;
  try {
    html = await getBilimselCalismalarHtml();
  } catch {
    html = "<p>İçerik yüklenemedi.</p>";
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">
        Bilimsel Çalışmalar
      </h1>
      <div
        className="prose-calm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
