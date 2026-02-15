import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { getSiteSettings, setSiteSetting } from "@/src/lib/site-settings";

const FILE_PREFIX = "file:";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id gerekli." }, { status: 400 });

  if (id.startsWith(FILE_PREFIX)) {
    const filename = id.slice(FILE_PREFIX.length).trim();
    if (!filename) return NextResponse.json({ error: "Geçersiz id." }, { status: 400 });
    try {
      const settings = await getSiteSettings();
      const hidden = settings.galleryHiddenFiles ?? [];
      if (hidden.includes(filename)) return NextResponse.json({ success: true });
      await setSiteSetting("galleryHiddenFiles", [...hidden, filename]);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json(
        { error: "Gizleme kaydedilemedi." },
        { status: 503 }
      );
    }
  }

  try {
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Silinemedi veya kayıt bulunamadı." },
      { status: 404 }
    );
  }
}
