import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const row = await prisma.galleryImage.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });
  if (!row) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mimeType,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
