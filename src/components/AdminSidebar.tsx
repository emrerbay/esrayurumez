"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4 min-h-screen">
      <Link href="/admin/dashboard" className="font-heading font-semibold text-primary block mb-6">
        Yönetim
      </Link>
      <nav className="space-y-1">
        <Link href="/admin/dashboard" className="block py-2 text-sm text-text-main hover:text-primary">Dashboard</Link>
        <Link href="/admin/posts" className="block py-2 text-sm text-text-main hover:text-primary">Yazılar</Link>
        <Link href="/admin/comments" className="block py-2 text-sm text-text-main hover:text-primary">Yorumlar</Link>
        <Link href="/admin/settings" className="block py-2 text-sm text-text-main hover:text-primary">Site Ayarları</Link>
        <Link href="/" className="block py-2 text-sm text-text-main hover:text-primary">Siteye Dön</Link>
        <button type="button" onClick={logout} className="block pt-4 text-sm text-red-600 hover:underline text-left">
          Çıkış
        </button>
      </nav>
    </aside>
  );
}
