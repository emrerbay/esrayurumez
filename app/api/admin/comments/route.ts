import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  await requireAdmin();
  const status = request.nextUrl.searchParams.get("status") ?? "";
  const where =
    status === "PENDING" ? { status: "PENDING" } : status === "APPROVED" ? { status: "APPROVED" } : status === "SPAM" ? { status: "SPAM" } : {};
  try {
    const comments = await prisma.comment.findMany({
      where,
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { data: [], error: "Veritabanına bağlanılamadı." },
      { status: 200 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await requireAdmin();
  let body: { id: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  const status = body.status === "APPROVED" || body.status === "SPAM" ? body.status : "PENDING";
  try {
    await prisma.comment.update({
      where: { id: body.id },
      data: { status },
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
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Veritabanına bağlanılamadı." }, { status: 503 });
  }
}
