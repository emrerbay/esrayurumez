"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Giriş yapılamadı.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin/dashboard";
      return;
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-accent px-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
        <h1 className="font-heading text-2xl font-bold text-text-main mb-6 text-center">Yönetim Girişi</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-user" className="block text-sm font-medium text-text-main mb-1">Kullanıcı adı</label>
            <input
              id="admin-user"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-sm font-medium text-text-main mb-1">Şifre</label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş"}
          </button>
        </form>
      </div>
    </div>
  );
}
