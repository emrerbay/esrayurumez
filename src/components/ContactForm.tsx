"use client";

import { useState } from "react";

const KVKK_CONSENT =
  "Kişisel verilerimin iletişim amacıyla işlenmesini kabul ediyorum. (KVKK Aydınlatma Metni)";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!kvkk) {
      setErrorMsg("Lütfen KVKK onayını işaretleyin.");
      return;
    }
    if (website) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim(),
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Gönderilemedi.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
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
          <label htmlFor="contact-name" className="block text-sm font-medium text-text-main mb-1">Ad Soyad *</label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-text-main mb-1">E-posta *</label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-text-main mb-1">Telefon</label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          maxLength={30}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-text-main mb-1">Mesajınız *</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
          maxLength={5000}
        />
      </div>
      <div className="flex items-start gap-2">
        <input
          id="contact-kvkk"
          type="checkbox"
          checked={kvkk}
          onChange={(e) => setKvkk(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="contact-kvkk" className="text-sm text-text-main/85">{KVKK_CONSENT}</label>
      </div>
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      {status === "success" && <p className="text-primary font-medium text-sm">Mesajınız alındı. En kısa sürede dönüş yapacağız.</p>}
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
