import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import sharp from "sharp";

const MAX_RESPONSE_BYTES = 3.5 * 1024 * 1024; // Vercel ~4.5 MB limitinin altında kalmak için
const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 82;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  try {
    const row = await prisma.galleryImage.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    });
    if (!row || row.data == null) return new NextResponse("Not found", { status: 404 });

    const data = row.data;
    let body = Buffer.isBuffer(data)
      ? data
      : (data as unknown) instanceof Uint8Array
        ? Buffer.from(data as Uint8Array)
        : Buffer.from(data as ArrayLike<number>);

    let contentType = row.mimeType;
    if (body.length > MAX_RESPONSE_BYTES) {
      try {
        body = await sharp(body)
          .resize(MAX_LONG_EDGE, MAX_LONG_EDGE, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toBuffer();
        contentType = "image/jpeg";
      } catch {
        return new NextResponse("Image too large", { status: 500 });
      }
    }

    return new NextResponse(body as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch {
    return new NextResponse("Internal error", { status: 500 });
  }
}
