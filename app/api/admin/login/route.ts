import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyAdminCredentials } from "@/src/lib/auth";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "Kullanıcı adı ve şifre gerekli." }, { status: 400 });
  }
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Hatalı giriş bilgileri." }, { status: 401 });
  }
  const session = await getSession();
  session.admin = true;
  session.loginAt = Date.now();
  await session.save();
  return NextResponse.json({ success: true });
}
