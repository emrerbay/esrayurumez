import Image from "next/image";
import Link from "next/link";

const DEFAULT_UNVAN = "Bebek, Çocuk ve Ergen Psikiyatrisi Uzmanı";
const DEFAULT_KURUMLAR = [
  "Ankara Üniversitesi Tıp Fakültesi",
  "Çocuk ve Ergen Ruh Sağlığı ve Hastalıkları Anabilim Dalı Öğretim Üyesi",
  "Ankara Üniversitesi Psikiyatri Otizm Araştırma ve Uygulama Merkezi Yönetim Kurulu Üyesi",
];
const DEFAULT_CALISMA_ALANLARI = [
  "Bebek, çocuk ve ergen ruh sağlığı değerlendirme ve tedavisi",
  "Otizm spektrum bozuklukları",
  "Aile danışmanlığı ve ebeveyn destek programları",
  "Okul çağı çocuklarında davranış ve dikkat sorunları",
  "Ergenlerde kaygı, depresyon ve kimlik gelişimi",
];

export interface ProfileSectionProps {
  /** Unvan (admin’den) */
  profileTitle?: string;
  /** Kurumlar listesi (admin’den, satır satır) */
  institutions?: string[];
  /** Çalışma alanları listesi (admin’den) */
  workAreas?: string[];
}

export function ProfileSection({ profileTitle, institutions, workAreas }: ProfileSectionProps = {}) {
  const unvan = profileTitle?.trim() || DEFAULT_UNVAN;
  const kurumlar = institutions?.length ? institutions : DEFAULT_KURUMLAR;
  const calismaAlanlari = workAreas?.length ? workAreas : DEFAULT_CALISMA_ALANLARI;

  return (
    <section className="bg-white py-14 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Sol: Unvan + kurumlar + Yorum yaz + Çalışma Alanlarım | Sağ: Fotoğraf */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Sol: Unvan, kurumlar, CTA ve Çalışma Alanlarım */}
          <div className="order-2 md:order-1 space-y-8">
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-primary mb-5 leading-snug">
                {unvan}
              </h2>
              <ul className="space-y-3.5 text-text-main/90 mb-8">
                {kurumlar.map((kurum) => (
                  <li key={kurum} className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-[15px] md:text-base leading-relaxed">{kurum}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#sizden-gelenler"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span>Yorum yaz</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Çalışma Alanlarım — sol sütunda, Yorum yaz'ın altında */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-bg-accent/70 to-white border border-gray-100 shadow-md">
              <h3 className="font-heading text-lg font-bold text-text-main mb-4">
                Çalışma Alanlarım
              </h3>
              <ul className="space-y-2.5">
                {calismaAlanlari.map((alan) => (
                  <li key={alan} className="flex items-start gap-2.5 text-sm text-text-main/90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="leading-relaxed">{alan}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sağ: Sadece fotoğraf */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl shadow-xl shadow-gray-200/60 ring-1 ring-black/5">
              <Image
                src="/images/esra-yurumez.jpeg"
                alt="Prof. Dr. Esra Yürümez"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
