import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { getSiteSettings } from "@/src/lib/site-settings";
import { sendCommentNotificationEmail } from "@/src/lib/send-notification-email";
import { checkRateLimit } from "@/src/lib/rate-limit";
import crypto from "crypto";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  return ip;
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + (process.env.SESSION_SECRET ?? "salt"), "utf8").digest("hex");
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "comment")) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body: {
    postId?: string;
    name?: string;
    email?: string;
    message?: string;
    rating?: number;
    kvkkConsent?: boolean;
    website?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ error: "Gönderilemedi." }, { status: 400 });
  }
  if (!body.postId || !body.name?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Ad, soyad ve yorum alanları zorunludur." }, { status: 400 });
  }
  if (!body.kvkkConsent) {
    return NextResponse.json({ error: "KVKK onayı gereklidir." }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: body.postId } });
  if (!post) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });

  const rating = body.rating != null ? Math.min(5, Math.max(1, Math.round(body.rating))) : null;

  await prisma.comment.create({
    data: {
      postId: body.postId,
      name: body.name.trim().slice(0, 100),
      email: body.email?.trim().slice(0, 255) || null,
      message: body.message.trim().slice(0, 2000),
      rating,
      status: "PENDING",
      ipHash: hashIp(ip),
      kvkkConsent: true,
    },
  });

  const notifyTo = (await getSiteSettings()).notificationEmail?.trim();
  if (notifyTo) {
    sendCommentNotificationEmail({
      to: notifyTo,
      source: "blog",
      authorName: body.name.trim(),
      authorEmail: body.email?.trim() || null,
      message: body.message.trim(),
      postTitle: post.title,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
