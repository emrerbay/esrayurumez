"use client";

import { useState } from "react";

const KVKK_CONSENT =
  "Kişisel verilerimin bu form kapsamında işlenmesini ve iletişim için kullanılmasını kabul ediyorum. (KVKK Aydınlatma Metni)";

export function CommentForm({ postId }: { postId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [kvkk, setKvkk] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!kvkk) {
      setErrorMsg("Lütfen KVKK onayını işaretleyin.");
      return;
    }
    if (honeypot) return; // spam
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          name: name.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
          rating: rating === "" ? undefined : Number(rating),
          kvkkConsent: kvkk,
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setRating("");
      setKvkk(false);
    } catch {
      setStatus("error");
      setErrorMsg("Bir hata oluştu.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="comment-name" className="block text-sm font-medium text-text-main mb-1">
            Ad Soyad *
          </label>
          <input
            id="comment-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="comment-email" className="block text-sm font-medium text-text-main mb-1">
            E-posta (isteğe bağlı)
          </label>
          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="comment-website">Website</label>
        <input
          id="comment-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-main mb-1">Değerlendirme (isteğe bağlı)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(rating === n ? "" : n)}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                rating === n
                  ? "bg-accent border-accent text-white"
                  : "border-gray-200 text-text-main/70 hover:border-primary"
              }`}
            >
              ★ {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment-message" className="block text-sm font-medium text-text-main mb-1">
          Yorumunuz *
        </label>
        <textarea
          id="comment-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          maxLength={2000}
        />
      </div>
      <div className="flex items-start gap-2">
        <input
          id="comment-kvkk"
          type="checkbox"
          checked={kvkk}
          onChange={(e) => setKvkk(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="comment-kvkk" className="text-sm text-text-main/85">
          {KVKK_CONSENT}
        </label>
      </div>
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      {status === "success" && (
        <p className="text-primary font-medium text-sm">Yorumunuz alındı. Onay sonrası yayınlanacaktır.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === "sending" ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
