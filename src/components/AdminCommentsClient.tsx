"use client";

import { useState, useEffect } from "react";

type Comment = {
  id: string;
  postId: string;
  name: string;
  email: string | null;
  message: string;
  rating: number | null;
  status: string;
  createdAt: string;
  post: { title: string; slug: string };
};

export function AdminCommentsClient() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const url = filter ? `/api/admin/comments?status=${filter}` : "/api/admin/comments";
    setDbError(null);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setComments(list);
        if (data?.error) setDbError(data.error);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  async function remove(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <p className="text-text-main/70">Yükleniyor...</p>;

  return (
    <div>
      {dbError && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {dbError}
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-lg text-sm ${filter === "" ? "bg-primary text-white" : "bg-white border"}`}
        >
          Tümü
        </button>
        <button
          type="button"
          onClick={() => setFilter("PENDING")}
          className={`px-3 py-1.5 rounded-lg text-sm ${filter === "PENDING" ? "bg-primary text-white" : "bg-white border"}`}
        >
          Bekleyen
        </button>
        <button
          type="button"
          onClick={() => setFilter("APPROVED")}
          className={`px-3 py-1.5 rounded-lg text-sm ${filter === "APPROVED" ? "bg-primary text-white" : "bg-white border"}`}
        >
          Onaylı
        </button>
        <button
          type="button"
          onClick={() => setFilter("SPAM")}
          className={`px-3 py-1.5 rounded-lg text-sm ${filter === "SPAM" ? "bg-primary text-white" : "bg-white border"}`}
        >
          Spam
        </button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-accent">
            <tr>
              <th className="text-left p-3">Yazar / Yazı</th>
              <th className="text-left p-3">Mesaj</th>
              <th className="text-left p-3">Durum</th>
              <th className="text-left p-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-text-main/60">{c.post?.title ?? c.postId}</p>
                </td>
                <td className="p-3 max-w-xs truncate">{c.message}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  {c.status !== "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(c.id, "APPROVED")}
                      className="text-primary text-xs hover:underline"
                    >
                      Onayla
                    </button>
                  )}
                  {c.status !== "SPAM" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(c.id, "SPAM")}
                      className="text-orange-600 text-xs hover:underline"
                    >
                      Spam
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comments.length === 0 && (
          <p className="p-6 text-center text-text-main/70">Yorum yok.</p>
        )}
      </div>
    </div>
  );
}
