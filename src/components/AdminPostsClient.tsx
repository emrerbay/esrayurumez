"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published: boolean;
  updatedAt: string;
};

export function AdminPostsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setPosts(list);
        if (data?.error) setMessage({ type: "err", text: data.error });
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/posts", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({ type: "ok", text: "Yazı eklendi." });
        setPosts((prev) => [{ id: data.id ?? "", slug: data.slug ?? "", title: file.name, excerpt: null, published: true, updatedAt: new Date().toISOString() }, ...prev]);
      } else {
        setMessage({ type: "err", text: data.error ?? "Yüklenemedi." });
      }
    } catch {
      setMessage({ type: "err", text: "Bağlantı hatası." });
    }
    setUploading(false);
    e.target.value = "";
  }

  async function togglePublish(post: Post) {
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    if (res.ok) setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
  }

  if (loading) return <p className="text-text-main/70">Yükleniyor...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="px-4 py-2 rounded-xl bg-primary text-white font-medium cursor-pointer hover:bg-primary/90">
          {uploading ? "Yükleniyor..." : "Yeni .docx yükle"}
          <input
            type="file"
            accept=".docx"
            className="hidden"
            disabled={uploading}
            onChange={onUpload}
          />
        </label>
        <span className="text-sm text-text-main/70">Blog yazısı .docx dosyası yükleyin.</span>
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-primary font-medium" : "text-red-600"}>{message.text}</p>
      )}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-accent">
            <tr>
              <th className="text-left p-3">Başlık</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Durum</th>
              <th className="text-left p-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3 text-text-main/70">{p.slug}</td>
                <td className="p-3">{p.published ? "Yayında" : "Taslak"}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/blog/${p.slug}`} target="_blank" className="text-primary text-xs hover:underline">Görüntüle</Link>
                  <button type="button" onClick={() => togglePublish(p)} className="text-secondary text-xs hover:underline">
                    {p.published ? "Yayından kaldır" : "Yayınla"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-text-main/70">Henüz yazı yok. .docx yükleyin veya seed çalıştırın.</p>}
      </div>
    </div>
  );
}
