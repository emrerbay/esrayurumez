import { NextRequest, NextResponse } from "next/server";
import { getPhotoFsPath } from "@/src/lib/gallery";
import fs from "fs";

export async function GET(request: NextRequest) {
  const f = request.nextUrl.searchParams.get("f");
  if (!f) return new NextResponse("Missing f", { status: 400 });
  const fsPath = getPhotoFsPath(f);
  if (!fsPath) return new NextResponse("Not found", { status: 404 });
  const buf = fs.readFileSync(fsPath);
  const ext = fsPath.split(".").pop()?.toLowerCase() ?? "jpeg";
  const contentType =
    ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : ext === "webp" ? "image/webp" : "image/jpeg";
  return new NextResponse(new Uint8Array(buf), {
    headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000" },
  });
}
