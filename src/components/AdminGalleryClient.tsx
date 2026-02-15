"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type GalleryItem =
  | { id: string; source: "db"; mimeType: string; sortOrder: number; createdAt: string }
  | { id: string; source: "filesystem"; filename: string };

function imageUrl(item: GalleryItem): string {
  if (item.source === "db") return `/api/gallery/image/${item.id}`;
  return `/api/gallery/image?f=${encodeURIComponent(item.filename)}`;
}

export function AdminGalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else if (data?.error) setMessage({ type: "err", text: data.error });
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({ type: "ok", text: "Görsel eklendi." });
        load();
      } else {
        setMessage({ type: "err", text: data.error ?? "Yüklenemedi." });
      }
    } catch {
      setMessage({ type: "err", text: "Bağlantı hatası." });
    }
    setUploading(false);
    e.target.value = "";
  }

  async function onDelete(id: string) {
    if (!confirm("Bu görseli galeriden kaldırmak istediğinize emin misiniz?")) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/gallery/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({ type: "ok", text: "Görsel kaldırıldı." });
        setItems((prev) => prev.filter((p) => p.id !== id));
      } else {
        setMessage({ type: "err", text: data.error ?? "Silinemedi." });
      }
    } catch {
      setMessage({ type: "err", text: "Bağlantı hatası." });
    }
  }

  if (loading) return <p className="text-text-main/70">Yükleniyor...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="px-4 py-2 rounded-xl bg-primary text-white font-medium cursor-pointer hover:bg-primary/90">
          {uploading ? "Yükleniyor..." : "Görsel ekle"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={onUpload}
          />
        </label>
        <span className="text-sm text-text-main/70">
          JPEG, PNG, WebP veya GIF. En fazla 10 MB.
        </span>
      </div>

      {message && (
        <p
          className={
            message.type === "ok"
              ? "text-green-700 text-sm"
              : "text-red-700 text-sm"
          }
        >
          {message.text}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-text-main/70 py-8">
          Henüz galeri görseli yok. Yukarıdan ekleyebilirsiniz veya klasöre (esrayurumez-files/photos) görsel ekleyip sayfayı yenileyin.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-bg-accent">
                <Image
                  src={imageUrl(item)}
                  alt={item.source === "filesystem" ? item.filename : "Galeri"}
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
              </div>
              <div className="p-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
