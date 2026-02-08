interface Comment {
  id: string;
  name: string;
  message: string;
  rating: number | null;
  createdAt: Date;
}

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="text-text-main/70 text-sm">Henüz onaylanmış yorum yok.</p>;
  }
  return (
    <ul className="space-y-4 mb-8">
      {comments.map((c) => (
        <li key={c.id} className="pl-4 border-l-2 border-primary/30">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-text-main">{c.name}</span>
            {c.rating != null && (
              <span className="text-sm text-accent">★ {c.rating}/5</span>
            )}
            <time className="text-xs text-text-main/60">
              {new Date(c.createdAt).toLocaleDateString("tr-TR")}
            </time>
          </div>
          <p className="text-text-main/90 text-sm mt-1 whitespace-pre-wrap">{c.message}</p>
        </li>
      ))}
    </ul>
  );
}
