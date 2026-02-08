"use client";

import { useState, useEffect } from "react";

type Entry = { id: string; name: string; message: string; createdAt: string };

export function GuestbookSection() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setEntries([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !message.trim()) {
      setError("Ad ve yorum alanları zorunludur.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gönderilemedi.");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setEntries((prev) => [
        { id: "", name: name.trim(), message: message.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ]);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "";
    }
  }

  return (
    <section id="sizden-gelenler" className="bg-white py-16 md:py-24 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-main mb-3">
            Sizden Gelenler
          </h2>
          <p className="text-text-main/80 max-w-2xl mx-auto">
            Görüş ve yorumlarınızı aşağıdaki form ile paylaşabilirsiniz.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-bg-accent/60 border border-gray-100 shadow-sm">
              <h3 className="font-heading text-xl font-semibold text-text-main mb-6">
                Yorumunuzu yazın
              </h3>
              {sent && (
                <p className="mb-4 text-sm text-primary font-medium">
                  Yorumunuz alındı. Teşekkür ederiz.
                </p>
              )}
              {error && (
                <p className="mb-4 text-sm text-red-600">{error}</p>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="gb-name" className="block text-sm font-medium text-text-main mb-1">
                    Adınız *
                  </label>
                  <input
                    id="gb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gb-email" className="block text-sm font-medium text-text-main mb-1">
                    E-posta (isteğe bağlı)
                  </label>
                  <input
                    id="gb-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="gb-message" className="block text-sm font-medium text-text-main mb-1">
                    Yorumunuz *
                  </label>
                  <textarea
                    id="gb-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                    placeholder="Mesajınızı yazın..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </form>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="font-heading text-xl font-semibold text-text-main mb-6">
              Son yorumlar
            </h3>
            {entries.length === 0 ? (
              <p className="text-text-main/70 text-sm">Henüz yorum yok. İlk yorumu siz yazın.</p>
            ) : (
              <ul className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <li
                    key={entry.id || `${entry.name}-${entry.createdAt}`}
                    className="p-4 rounded-xl bg-bg-accent/50 border border-gray-100"
                  >
                    <p className="text-text-main font-medium mb-1">{entry.name}</p>
                    <p className="text-sm text-text-main/85 whitespace-pre-wrap">{entry.message}</p>
                    {entry.createdAt && (
                      <p className="text-xs text-text-main/60 mt-2">{formatDate(entry.createdAt)}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
