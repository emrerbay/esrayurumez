"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FALLBACK_INSTAGRAM = "https://www.instagram.com/prof.dr.esrayurumez/";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const nav = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/bilimsel-calismalar", label: "Bilimsel Çalışmalar" },
  { href: "/galeri", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

type HeaderProps = { settings?: { instagramUrl?: string } | null };

export function Header({ settings }: HeaderProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const instagramUrl = settings?.instagramUrl?.trim() || FALLBACK_INSTAGRAM;

  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16 md:h-18">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src="/logo/logo.png"
              alt="Prof. Dr. Esra Yürümez"
              fill
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <span className="font-heading font-semibold text-text-main hidden sm:inline text-sm md:text-base">
            Prof. Dr. Esra Yürümez
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-primary"
                  : "text-text-main hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-text-main hover:text-primary hover:bg-bg-accent transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-text-main hover:bg-bg-accent"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menüyü aç"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4">
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 text-sm font-medium ${
                  pathname === item.href ? "text-primary" : "text-text-main"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 flex items-center gap-2 text-sm font-medium text-text-main"
              onClick={() => setOpen(false)}
            >
              <InstagramIcon className="w-5 h-5" /> Instagram
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
