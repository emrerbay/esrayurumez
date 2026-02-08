import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { checkRateLimit } from "@/src/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip, "contact")) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ error: "Gönderilemedi." }, { status: 400 });
  }
  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Ad, e-posta ve mesaj zorunludur." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().slice(0, 255),
      phone: body.phone?.trim().slice(0, 30) || null,
      message: body.message.trim().slice(0, 5000),
    },
  });

  return NextResponse.json({ success: true });
}
