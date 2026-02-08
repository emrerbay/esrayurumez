import Link from "next/link";
import type { SiteSettingsMap } from "@/src/lib/site-settings";

const FALLBACK_PHONE = "0312 595 7978";
const FALLBACK_EMAIL = "esrayurumez@gmail.com";
const FALLBACK_INSTAGRAM = "https://www.instagram.com/prof.dr.esrayurumez/";
const FALLBACK_DESC = "Çocuk ve Ergen Ruh Sağlığı alanında bilimsel ve empatik destek.";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function instagramHandle(url: string): string {
  try {
    const u = url.trim();
    if (!u) return "Instagram";
    const m = u.match(/instagram\.com\/([^/?]+)/);
    return m ? m[1] : "Instagram";
  } catch {
    return "Instagram";
  }
}

export function Footer({ settings }: { settings: SiteSettingsMap | null }) {
  const phone = settings?.contactPhone?.trim() || FALLBACK_PHONE;
  const email = settings?.contactEmail?.trim() || FALLBACK_EMAIL;
  const instagramUrl = settings?.instagramUrl?.trim() || FALLBACK_INSTAGRAM;
  const description = settings?.footerDescription?.trim() || FALLBACK_DESC;

  return (
    <footer className="bg-text-main text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-3">Prof. Dr. Esra Yürümez</h3>
            <p className="text-sm text-white/85 mb-4">
              {description}
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/85">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-5 h-5" /> {instagramHandle(instagramUrl)}
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-3">Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimda" className="text-white/85 hover:text-white transition-colors">Hakkımda</Link></li>
              <li><Link href="/bilimsel-calismalar" className="text-white/85 hover:text-white transition-colors">Bilimsel Çalışmalar</Link></li>
              <li><Link href="/blog" className="text-white/85 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/galeri" className="text-white/85 hover:text-white transition-colors">Galeri</Link></li>
              <li><Link href="/iletisim" className="text-white/85 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-3">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gizlilik-politikasi" className="text-white/85 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-sartlari" className="text-white/85 hover:text-white transition-colors">Kullanım Şartları</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-white/75">
          © {new Date().getFullYear()} Prof. Dr. Esra Yürümez. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
