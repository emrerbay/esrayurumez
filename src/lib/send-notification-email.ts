/**
 * Yorum bildirimi e-postası gönderir.
 * SMTP ayarları .env'de: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (isteğe bağlı)
 * Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=xxx@gmail.com, SMTP_PASS=Uygulama Şifresi
 */

export type CommentNotificationPayload = {
  to: string;
  source: "blog" | "guestbook";
  authorName: string;
  authorEmail?: string | null;
  message: string;
  postTitle?: string; // blog için
};

export async function sendCommentNotificationEmail(
  payload: CommentNotificationPayload
): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass || !payload.to?.trim()) return false;

  const from = process.env.SMTP_FROM?.trim() || user;
  const subject =
    payload.source === "blog"
      ? `[Site] Blog yorumu: ${payload.postTitle ?? "Yazı"} — ${payload.authorName}`
      : `[Site] Anasayfa yorumu — ${payload.authorName}`;

  const body = [
    `Kaynak: ${payload.source === "blog" ? "Blog yorumu" : "Anasayfa (Sizden Gelenler)"}`,
    payload.postTitle ? `Yazı: ${payload.postTitle}` : "",
    `Gönderen: ${payload.authorName}`,
    payload.authorEmail ? `E-posta: ${payload.authorEmail}` : "",
    "",
    "Mesaj:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const nodemailer = await import("nodemailer");
    const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"Site Bildirimi" <${from}>`,
      to: payload.to.trim(),
      subject,
      text: body,
    });
    return true;
  } catch {
    return false;
  }
}
