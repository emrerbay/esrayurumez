import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { getSiteSettings, setSiteSetting, SiteSettingsMap } from "@/src/lib/site-settings";

export async function GET() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  await requireAdmin();
  let body: Partial<SiteSettingsMap>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const keys = Object.keys(body) as (keyof SiteSettingsMap)[];
  for (const key of keys) {
    if (body[key] !== undefined) await setSiteSetting(key, body[key]);
  }
  return NextResponse.json({ success: true });
}
