import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { BlogCard } from "@/src/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Çocuk ve ergen ruh sağlığı hakkında yazılar.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  let dbError = false;
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-4">Blog</h1>
      <p className="text-text-main/85 mb-8">
        Çocuk ve ergen ruh sağlığı konularında bilgilendirici yazılar.
      </p>
      <p className="text-sm text-text-main/70 mb-8">
        Bu içerikler bilgilendirme amaçlıdır ve profesyonel tıbbi tavsiye yerine geçmez.
      </p>

      {dbError ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-amber-800 text-center">
          <p className="font-medium mb-1">Veritabanına bağlanılamadı.</p>
          <p className="text-sm">Blog yazıları şu an listelenemiyor. Lütfen daha sonra tekrar deneyin veya site yöneticisi ile iletişime geçin.</p>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-text-main/70 py-12">Henüz yazı yok. Yönetici panelinden .docx yükleyebilir veya <code className="bg-bg-accent px-1 rounded">npm run db:seed</code> çalıştırabilirsiniz.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt ?? undefined}
              coverImageUrl={post.coverImageUrl ?? undefined}
              updatedAt={post.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
