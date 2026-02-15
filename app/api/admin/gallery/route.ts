import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { getSiteSettings } from "@/src/lib/site-settings";
import { getVisibleGalleryFilenames } from "@/src/lib/gallery";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const FILE_PREFIX = "file:";

export async function GET() {
  await requireAdmin();
  try {
    const [dbList, settings] = await Promise.all([
      prisma.galleryImage.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, mimeType: true, sortOrder: true, createdAt: true },
      }),
      getSiteSettings(),
    ]);
    const hidden = settings.galleryHiddenFiles ?? [];
    const fsFilenames = getVisibleGalleryFilenames(hidden);

    const dbItems = dbList.map((row) => ({
      id: row.id,
      source: "db" as const,
      mimeType: row.mimeType,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
    }));
    const fsItems = fsFilenames.map((filename) => ({
      id: FILE_PREFIX + filename,
      source: "filesystem" as const,
      filename,
    }));

    return NextResponse.json([...dbItems, ...fsItems]);
  } catch {
    return NextResponse.json(
      { error: "Veritabanına bağlanılamadı." },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin();
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "FormData gerekli." }, { status: 400 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "Görsel dosyası gerekli." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP veya GIF yükleyebilirsiniz." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Dosya en fazla 10 MB olabilir." },
      { status: 400 }
    );
  }
  const buf = Buffer.from(await file.arrayBuffer());
  try {
    const maxOrder = await prisma.galleryImage.aggregate({
      _max: { sortOrder: true },
    });
    const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
    const row = await prisma.galleryImage.create({
      data: { data: buf, mimeType: file.type, sortOrder },
    });
    return NextResponse.json({ id: row.id, sortOrder: row.sortOrder });
  } catch {
    return NextResponse.json(
      { error: "Veritabanına kaydedilemedi." },
      { status: 503 }
    );
  }
}
