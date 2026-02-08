import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
}

export function Hero({ title, subtitle, ctaText = "Randevu Talep Et" }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-bg-accent/30 to-white">
      {/* Üst ince vurgu çizgisi */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />
      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="font-heading text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.2em] mb-3">
            Bebek, Çocuk ve Ergen Psikiyatrisi
          </p>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4 leading-[1.15] tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-text-main/80 mb-8 leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            {ctaText && (
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {ctaText}
              </Link>
            )}
            <Link
              href="/hakkimda"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-primary font-semibold text-sm border-2 border-primary hover:bg-primary hover:text-white transition-all"
            >
              Hakkımda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
