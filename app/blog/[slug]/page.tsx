import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db";
import { CommentList } from "@/src/components/CommentList";
import { CommentForm } from "@/src/components/CommentForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Yazı bulunamadı" };
  const desc = post.excerpt ?? post.title;
  return {
    title: post.title,
    description: desc.slice(0, 160),
    openGraph: { title: post.title, description: desc },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!post) notFound();

  const avgRating =
    post.comments.filter((c: { rating: number | null }) => c.rating != null).length > 0
      ? post.comments.reduce((s: number, c: { rating: number | null }) => s + (c.rating ?? 0), 0) /
        post.comments.filter((c: { rating: number | null }) => c.rating != null).length
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: "Prof. Dr. Esra Yürümez" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-main">{post.title}</h1>
          <time className="text-sm text-text-main/60">
            {new Date(post.updatedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {avgRating != null && (
            <p className="mt-2 text-sm text-text-main/80">
              Ortalama değerlendirme: {avgRating.toFixed(1)}/5
            </p>
          )}
        </header>
        <div
          className="prose-calm mb-12"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
      </article>

      <section className="border-t border-gray-200 pt-8">
        <h2 className="font-heading text-xl font-semibold text-text-main mb-4">Yorumlar</h2>
        <CommentList comments={post.comments} />
        <CommentForm postId={post.id} />
      </section>
    </div>
  );
}
