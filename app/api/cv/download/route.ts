import { NextResponse } from "next/server";
import { getCvDocxPath } from "@/src/lib/cv-extract";
import fs from "fs";

export async function GET() {
  const cvPath = getCvDocxPath();
  if (!cvPath) return new NextResponse("Özgeçmiş dosyası bulunamadı.", { status: 404 });
  const buf = fs.readFileSync(cvPath);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="EsraYurumez-Ozgecmis.docx"',
    },
  });
}
