import path from "path";
import fs from "fs";
import mammoth from "mammoth";
import { sanitize } from "./sanitize";

const BILIMSEL_START = [
  "bilimsel çalışmalar",
  "bilimsel calismalar",
  "yayınlar",
  "yayinlar",
  "makaleler",
  "araştırmalar",
  "arastirmalar",
  "publications",
];

const SECTION_END = [
  "ödüller",
  "oduller",
  "eğitim",
  "egitim",
  "iletişim",
  "iletisim",
  "referanslar",
  "hakkımda",
  "hakkimda",
  "deneyim",
  "üyelikler",
  "uyelikler",
];

function extractBilimselFromHtml(html: string): string {
  const lower = html.toLowerCase();
  let startIdx = -1;
  for (const m of BILIMSEL_START) {
    const i = lower.indexOf(m);
    if (i !== -1 && (startIdx === -1 || i < startIdx)) startIdx = i;
  }
  if (startIdx === -1) return "<p>Bilimsel çalışmalar bölümü bu özgeçmişte bulunamadı.</p>";
  const before = html.lastIndexOf("<", startIdx);
  const start = before > 0 ? before : startIdx;
  const afterStart = html.slice(start);
  let endIdx = afterStart.length;
  const firstH2 = afterStart.indexOf("<h2");
  const firstH1 = afterStart.indexOf("<h1");
  const firstMajor =
    firstH1 >= 0 && (firstH2 < 0 || firstH1 < firstH2) ? firstH1 : firstH2;
  if (firstMajor > 0) {
    const sliceFrom = afterStart.slice(firstMajor);
    const cap = sliceFrom.match(/<h[12][^>]*>([^<]+)</i);
    if (cap) {
      const t = cap[1].toLowerCase().trim();
      if (SECTION_END.some((h) => t.startsWith(h))) endIdx = firstMajor;
    }
  }
  const section = afterStart.slice(0, endIdx).trim();
  return section || "<p>İçerik bulunamadı.</p>";
}

export function getCvDocxPath(): string | null {
  const base = path.join(process.cwd(), "esrayurumez-files", "özgeçmiş");
  if (!fs.existsSync(base)) return null;
  const files = fs.readdirSync(base);
  const docx = files.find((f) => /\.docx$/i.test(f));
  return docx ? path.join(base, docx) : null;
}

export async function getBilimselCalismalarHtml(): Promise<string> {
  const cvPath = getCvDocxPath();
  if (!cvPath) return "<p>Özgeçmiş dosyası bulunamadı.</p>";
  const buf = fs.readFileSync(cvPath);
  const result = await mammoth.convertToHtml(
    { buffer: buf },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh",
      ],
    }
  );
  const fullHtml = sanitize(result.value);
  return extractBilimselFromHtml(fullHtml);
}
