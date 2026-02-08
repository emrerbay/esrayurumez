import Link from "next/link";
import { prisma } from "@/src/lib/db";

export const dynamic = "force-dynamic";

async function getDashboardCounts(): Promise<{
  postCount: number;
  commentPending: number;
  contactCount: number;
  error: string | null;
}> {
  try {
    const [postCount, commentPending, contactCount] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
    ]);
    return { postCount, commentPending, contactCount, error: null };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Veritabanına bağlanılamadı. Lütfen DATABASE_URL ve Supabase projenizi kontrol edin.";
    return { postCount: 0, commentPending: 0, contactCount: 0, error: message };
  }
}

export default async function AdminDashboardPage() {
  const { postCount, commentPending, contactCount, error: dbError } =
    await getDashboardCounts();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Dashboard</h1>
      {dbError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <strong>Veritabanı uyarısı:</strong> {dbError}
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/admin/posts" className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
          <p className="text-3xl font-bold text-primary">{postCount}</p>
          <p className="text-sm text-text-main/80">Toplam yazı</p>
        </Link>
        <Link href="/admin/comments" className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow">
          <p className="text-3xl font-bold text-accent">{commentPending}</p>
          <p className="text-sm text-text-main/80">Bekleyen yorum</p>
        </Link>
        <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-3xl font-bold text-secondary">{contactCount}</p>
          <p className="text-sm text-text-main/80">Yeni iletişim</p>
        </div>
      </div>
    </div>
  );
}
