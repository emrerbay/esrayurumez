import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { getSiteSettings } from "@/src/lib/site-settings";
import { sendCommentNotificationEmail } from "@/src/lib/send-notification-email";
import { checkRateLimit } from "@/src/lib/rate-limit";

export async function GET() {
  try {
    const list = await prisma.guestbookEntry.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, name: true, message: true, createdAt: true },
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "guestbook")) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.message?.trim()) {
    return NextResponse.json(
      { error: "Ad ve yorum alanları zorunludur." },
      { status: 400 }
    );
  }

  try {
    await prisma.guestbookEntry.create({
      data: {
        name: body.name.trim().slice(0, 100),
        email: body.email?.trim().slice(0, 255) || null,
        message: body.message.trim().slice(0, 2000),
        status: "APPROVED",
      },
    });

    const notifyTo = (await getSiteSettings()).notificationEmail?.trim();
    if (notifyTo) {
      sendCommentNotificationEmail({
        to: notifyTo,
        source: "guestbook",
        authorName: body.name.trim(),
        authorEmail: body.email?.trim() || null,
        message: body.message.trim(),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
