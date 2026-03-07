import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { slugFromFilename } from "@/src/lib/slugify";
import { parseDocxToHtml, titleFromFilename } from "@/src/lib/docx";
import path from "path";
import fs from "fs";

export async function GET() {
  await requireAdmin();
  try {
    const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { data: [], error: "Veritabanına bağlanılamadı." },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin();
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.name) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
    }
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".docx") {
      return NextResponse.json({ error: "Sadece .docx dosyaları desteklenir." }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const originalName = path.basename(file.name);
    const safeName = originalName.replace(/[^a-zA-Z0-9._\s-]/g, "_");

    // Vercel'de dosya sistemi salt okunur; docx'i /tmp'e yazıp oradan parse ediyoruz
    const isVercel = !!process.env.VERCEL;
    const workDir = isVercel
      ? path.join("/tmp", "esrayurumez-blogs")
      : path.join(process.cwd(), "esrayurumez-files", "blogs");
    const destPath = path.join(workDir, `${Date.now()}-${safeName}`);
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
    fs.writeFileSync(destPath, buf);

    let html: string;
    try {
      const result = await parseDocxToHtml(destPath);
      html = result.html;
    } finally {
      if (isVercel && fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    // Başlık orijinal dosya adından (Türkçe karakterler korunur); slug dosya adından üretilir
    const title = titleFromFilename(originalName);
    const slug = slugFromFilename(originalName);
    const sourceDocxPath = isVercel ? null : destPath;

    try {
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        await prisma.post.update({
          where: { slug },
          data: { htmlContent: html, title, sourceDocxPath, updatedAt: new Date() },
        });
        return NextResponse.json({ success: true, slug });
      }
      await prisma.post.create({
        data: {
          slug,
          title,
          htmlContent: html,
          tags: "[]",
          published: true,
          sourceDocxPath,
        },
      });
      return NextResponse.json({ success: true, slug });
    } catch {
      return NextResponse.json({ error: "Veritabanına bağlanılamadı." }, { status: 503 });
    }
  }

  let body: { id?: string; title?: string; excerpt?: string; published?: boolean; tags?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  try {
    await prisma.post.update({
      where: { id: body.id },
      data: {
        ...(body.title != null && { title: body.title }),
        ...(body.excerpt != null && { excerpt: body.excerpt }),
        ...(body.published != null && { published: body.published }),
        ...(body.tags != null && { tags: JSON.stringify(body.tags) }),
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Veritabanına bağlanılamadı." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  await requireAdmin();
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Veritabanına bağlanılamadı." }, { status: 503 });
  }
}
