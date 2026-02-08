import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/src/lib/site-settings";
import { getCvDocxPath } from "@/src/lib/cv-extract";
import path from "path";
import fs from "fs";

export const metadata: Metadata = {
  title: "Hakkımda ve Özgeçmiş",
  description: "Prof. Dr. Esra Yürümez hakkında bilgi ve özgeçmiş.",
};

export const dynamic = "force-dynamic";

async function getAboutContent(): Promise<string> {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    return "<p>Hakkımda içeriği yüklenemedi.</p>";
  }
  const blocks = settings?.aboutBlocks;
  if (blocks) {
    try {
      const arr = JSON.parse(blocks) as Array<{ title?: string; content?: string }>;
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((b) => `<h2>${b.title ?? ""}</h2><div>${b.content ?? ""}</div>`).join("");
      }
    } catch {
      // ignore
    }
  }
  const aboutDir = path.join(process.cwd(), "esrayurumez-files", "hakkımda");
  if (!fs.existsSync(aboutDir)) return "<p>Hakkımda içeriği henüz eklenmemiştir.</p>";
  const files = fs.readdirSync(aboutDir);
  const docx = files.find((f: string) => /\.docx$/i.test(f));
  if (!docx) return "<p>Hakkımda içeriği için .docx dosyası bulunamadı. (Mevcut: .pages — Word formatına dönüştürülebilir.)</p>";
  const mammoth = await import("mammoth");
  const { sanitize } = await import("@/src/lib/sanitize");
  const buf = fs.readFileSync(path.join(aboutDir, docx));
  const styleMap = [
    "p[style-name='Heading 1'] => h2:fresh",
    "p[style-name='Heading 2'] => h3:fresh",
  ];
  const result = await mammoth.convertToHtml(
    { buffer: buf },
    { styleMap } as { styleMap: string[] }
  );
  return sanitize(result.value);
}

export default async function HakkimdaPage() {
  const [html, cvPath] = await Promise.all([getAboutContent(), getCvDocxPath()]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">Hakkımda ve Özgeçmiş</h1>

      <div
        className="prose-calm mb-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <section className="border-t border-gray-200 pt-8">
        <h2 className="font-heading text-xl font-semibold text-text-main mb-4">Özgeçmiş</h2>
        <p className="text-text-main/85 mb-4">
          Detaylı özgeçmişimi PDF/Word formatında indirebilirsiniz. Bilimsel çalışmalarım için
          ayrıca <Link href="/bilimsel-calismalar" className="text-primary hover:underline">Bilimsel Çalışmalar</Link> sayfasına bakınız.
        </p>
        {cvPath ? (
          <a
            href="/api/cv/download"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Özgeçmişi İndir
          </a>
        ) : (
          <p className="text-sm text-gray-500">Özgeçmiş dosyası (docx) henüz yüklenmedi.</p>
        )}
      </section>
    </div>
  );
}
