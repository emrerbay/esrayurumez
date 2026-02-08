import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  updatedAt: Date;
}

export function BlogCard({ slug, title, excerpt, coverImageUrl, updatedAt }: BlogCardProps) {
  const date = new Date(updatedAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
      {coverImageUrl && (
        <Link href={`/blog/${slug}`} className="relative w-full sm:w-48 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-bg-accent">
          <Image
            src={coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
            unoptimized
          />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <time className="text-sm text-text-main/60">{date}</time>
        <h2 className="font-heading text-xl font-semibold text-text-main mt-1">
          <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="text-text-main/85 mt-2 line-clamp-2 text-sm">{excerpt}</p>
        )}
        <Link
          href={`/blog/${slug}`}
          className="inline-block mt-2 text-primary font-medium text-sm hover:underline"
        >
          Devamını oku →
        </Link>
      </div>
    </article>
  );
}
