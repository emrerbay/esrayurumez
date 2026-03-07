import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

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
    const body = Buffer.isBuffer(data)
      ? data
      : (data as unknown) instanceof Uint8Array
        ? Buffer.from(data as Uint8Array)
        : Buffer.from(data as ArrayLike<number>);

    return new NextResponse(body as unknown as BodyInit, {
      headers: {
        "Content-Type": row.mimeType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch {
    return new NextResponse("Internal error", { status: 500 });
  }
}
