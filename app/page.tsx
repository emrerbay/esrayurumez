import Link from "next/link";
import { getSiteSettings } from "@/src/lib/site-settings";
import { Hero } from "@/src/components/Hero";
import { ProfileSection } from "@/src/components/ProfileSection";
import { GuestbookSection } from "@/src/components/GuestbookSection";
import { prisma } from "@/src/lib/db";

export const dynamic = "force-dynamic";

const HIZMET_ALANLARI = [
  {
    title: "Çocuk ve Ergen Değerlendirmesi",
    desc: "Kapsamlı gelişimsel ve ruhsal değerlendirme ile doğru yönlendirme.",
    icon: "🩺",
  },
  {
    title: "Aile Danışmanlığı",
    desc: "Aile içi iletişim ve davranış sorunlarında bilimsel temelli destek.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Eğitim ve Bilgilendirme",
    desc: "Blog ve kaynaklarla güvenilir bilgiye erişim.",
    icon: "📚",
  },
];

export default async function HomePage() {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  let postCount = 0;
  try {
    postCount = await prisma.post.count({ where: { published: true } });
  } catch {
    // Veritabanı bağlantısı yoksa 0 göster
  }
  const title = settings?.heroTitle ?? "Prof. Dr. Esra Yürümez";
  const subtitle = settings?.heroSubtitle ?? "Çocuk ve Ergen Ruh Sağlığı uzmanı olarak ailelere ve gençlere yönelik bilimsel, empatik ve güvenilir destek sunuyorum.";
  const ctaText = settings?.ctaText ?? "Randevu Talep Et";

  const profileTitle = settings?.profileTitle?.trim() || undefined;
  const institutions = (settings?.profileInstitutions ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const workAreas = (settings?.profileWorkAreas ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <Hero title={title} subtitle={subtitle} ctaText={ctaText} />

      <ProfileSection
        profileTitle={profileTitle}
        institutions={institutions.length ? institutions : undefined}
        workAreas={workAreas.length ? workAreas : undefined}
      />

      <section className="max-w-6xl mx-auto px-4 py-20 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-main mb-3">
            Hizmet Alanları
          </h2>
          <p className="text-text-main/80 max-w-2xl mx-auto">
            Bebek, çocuk ve ergen ruh sağlığı alanında sunduğum hizmetler.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {HIZMET_ALANLARI.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
              <span className="text-3xl mb-4 block" aria-hidden>{item.icon}</span>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">{item.title}</h3>
              <p className="text-text-main/85 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <GuestbookSection />

      <section className="bg-gradient-to-b from-bg-accent to-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-main mb-2">
                Blog Yazıları
              </h2>
              <p className="text-text-main/85 max-w-lg">
                Çocuk ve ergen ruh sağlığı hakkında güncel, bilimsel içerikler.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
            >
              Tüm Yazılar ({postCount})
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-sm text-text-main/70 max-w-2xl mx-auto">
          Bu içerikler bilgilendirme amaçlıdır ve profesyonel tıbbi tavsiye yerine geçmez.
          Tanı ve tedavi için lütfen bir uzmana başvurun.
        </p>
      </section>
    </>
  );
}
