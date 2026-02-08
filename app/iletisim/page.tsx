import type { Metadata } from "next";
import { getSiteSettings, DEFAULT_MAP_EMBED } from "@/src/lib/site-settings";
import { ContactForm } from "@/src/components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Prof. Dr. Esra Yürümez ile iletişime geçin.",
};

export const dynamic = "force-dynamic";

export default async function IletisimPage() {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  const phone = settings?.contactPhone ?? "";
  const email = settings?.contactEmail ?? "";
  const address = settings?.contactAddress ?? "";
  const whatsapp = settings?.whatsappNumber ?? "";
  const instagram = settings?.instagramUrl ?? "";
  const mapUrl = (settings?.mapEmbedUrl?.trim() || DEFAULT_MAP_EMBED);

  const directionsAddress = address?.trim() || "Ankara Üniversitesi Tıp Fakültesi Cebeci Hastanesi, Mamak, Ankara";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(directionsAddress)}`;

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">İletişim</h1>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-main mb-4">İletişim Bilgileri</h2>
          <ul className="space-y-3 text-text-main/90">
            {phone && (
              <li>
                <span className="font-medium">Telefon:</span>{" "}
                <a href={`tel:${phone}`} className="text-primary hover:underline">{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <span className="font-medium">E-posta:</span>{" "}
                <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
              </li>
            )}
            {address && (
              <li>
                <span className="font-medium">Adres:</span> {address}
              </li>
            )}
          </ul>
          <div className="flex gap-4 mt-6">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity"
              >
                WhatsApp ile Yaz
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#833ab4] text-white font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-main mb-4">Randevu / Mesaj</h2>
          <ContactForm />
        </div>
      </div>

      {mapUrl && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="font-heading text-lg font-semibold text-text-main">Konum</h2>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Yol tarifi al
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Harita"
              className="w-full h-full min-h-[300px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
