import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export interface SessionData {
  admin: boolean;
  loginAt: number;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_chars_long_change_me",
  cookieName: "esrayurumez_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax" as const,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return !!session.admin && !!session.loginAt;
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session.admin) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}

function getAdminPassHash(): string | null {
  let raw = process.env.ADMIN_PASS_HASH?.trim() ?? "";
  // .env'de tırnak içinde saklanmışsa kaldır (bcrypt hash $ ile başlamalı)
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1);
  }
  if (!raw) return null;
  // Bcrypt hash $2a$ veya $2b$ ile başlar; değilse base64 ile saklanmış olabilir
  if (!raw.startsWith("$2")) {
    try {
      return Buffer.from(raw, "base64").toString("utf8");
    } catch {
      return raw;
    }
  }
  return raw;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const u = username.trim();
  const p = password.trim();
  const adminUser = process.env.ADMIN_USER?.trim();
  if (!adminUser || u !== adminUser) return false;

  // Development: düz metin şifre (ADMIN_PASS) — sadece NODE_ENV=development
  if (process.env.NODE_ENV === "development") {
    const plainPass = process.env.ADMIN_PASS?.trim();
    if (plainPass && p === plainPass) return true;
  }

  const passHash = getAdminPassHash();
  if (!passHash) return false;
  return bcrypt.compareSync(p, passHash);
}
