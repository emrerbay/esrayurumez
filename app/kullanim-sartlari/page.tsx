import type { Metadata } from "next";
import { getSiteSettings } from "@/src/lib/site-settings";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "Prof. Dr. Esra Yürümez web sitesi kullanım şartları.",
};

export const dynamic = "force-dynamic";

const STATIC_TERMS = (
  <>
    <p className="text-text-main/80 mb-6">
      Son güncelleme: Şubat 2025. Bu web sitesini (“Site”) kullanarak aşağıdaki kullanım şartlarını
      kabul etmiş sayılırsınız. Lütfen metni dikkatlice okuyunuz.
    </p>

    <h2>1. Site Hakkında</h2>
    <p>
      Bu Site, Prof. Dr. Esra Yürümez’in (Bebek, Çocuk ve Ergen Psikiyatrisi Uzmanı) tanıtımı,
      bilgilendirme içerikleri, blog yazıları, iletişim ve randevu talebi için kullanılmaktadır.
      Site sahibi ve içerik sorumlusu Prof. Dr. Esra Yürümez’dir.
    </p>

    <h2>2. İçeriğin Niteliği — Tıbbi Tavsiye Değildir</h2>
    <p>
      Sitedeki tüm metinler, blog yazıları ve bilgilendirme içerikleri <strong>yalnızca genel
      bilgilendirme amaçlıdır</strong>. Bu içerikler, hiçbir şekilde profesyonel tıbbi veya
      psikiyatrik tavsiye, teşhis veya tedavi yerine geçmez. Çocuk veya ergeninizle ilgili sağlık
      kararları almadan önce mutlaka bir uzman hekime (çocuk ve ergen ruh sağlığı uzmanı veya
      ilgili branş) yüz yüze başvurmanız gerekir. Site üzerinden iletişim veya yorum bırakmanız
      hasta-hekim ilişkisi oluşturmaz.
    </p>

    <h2>3. Kullanım Koşulları</h2>
    <p>Siteyi yalnızca yasalara ve bu şartlara uygun biçimde kullanabilirsiniz. Aşağıdakiler yasaktır:</p>
    <ul>
      <li>Siteyi veya altyapısını zararlı yazılım, otomatik istekler veya yetkisiz müdahale ile
        bozmak veya engellemek</li>
      <li>Başkalarının kimliğine bürünmek veya yanıltıcı bilgi vermek</li>
      <li>Telif hakkı, ticari marka veya kişilik haklarına aykırı içerik paylaşmak</li>
      <li>Spam, hakaret, kişisel veri ifşası veya yasalara aykırı yorum/mesaj göndermek</li>
    </ul>
    <p>
      Bu kurallara uyulmaması hâlinde erişiminiz kısıtlanabilir ve gerekirse hukuki yollara
      başvurulabilir.
    </p>

    <h2>4. Fikri Mülkiyet</h2>
    <p>
      Sitedeki metinler, görseller, logo ve tasarım öğeleri (telif hakkı ve diğer fikri mülkiyet
      hakları) Prof. Dr. Esra Yürümez’e veya lisans veren taraflara aittir. İzinsiz kopyalama,
      çoğaltma, dağıtma veya ticari kullanım yasaktır. Alıntı yapılacaksa kaynak gösterilmesi
      gerekir.
    </p>

    <h2>5. Sorumluluk Reddi</h2>
    <p>
      Site “olduğu gibi” sunulmaktadır. Bağlantı kesintileri, teknik hatalar veya içerik
      güncellemelerinden doğan zararlardan site sahibi sorumlu tutulamaz. Üçüncü taraf
      sitelerine verilen bağlantıların içeriğinden Site sorumlu değildir.
    </p>

    <h2>6. İletişim Formu ve Yorumlar</h2>
    <p>
      İletişim formu ve anasayfa/blog yorumları aracılığıyla gönderdiğiniz bilgiler, yalnızca
      iletişim ve (onaylanırsa) yayınlama amacıyla kullanılır. Gönderdiğiniz içeriklerin
      yasalara ve bu şartlara uygun olması sizin sorumluluğunuzdadır. Küfür, iftira veya
      kişisel veri içeren yorumlar yayına alınmayabilir veya kaldırılabilir.
    </p>

    <h2>7. Değişiklikler</h2>
    <p>
      Bu kullanım şartları önceden bildirilmeksizin güncellenebilir. Değişiklikler bu sayfada
      yayımlandığı anda yürürlüğe girer. Siteyi kullanmaya devam etmeniz güncel şartları kabul
      ettiğiniz anlamına gelir.
    </p>

    <h2>8. Uygulanacak Hukuk ve İletişim</h2>
    <p>
      Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Ankara mahkemeleri
      ve icra daireleri yetkilidir. Sorularınız için: esrayurumez@gmail.com
    </p>
  </>
);

export default async function KullanimSartlariPage() {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  const customContent = settings?.termsOfUse;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">Kullanım Şartları</h1>
      <div className="prose-calm">
        {typeof customContent === "string" && customContent.trim() ? (
          <div className="whitespace-pre-wrap">{customContent}</div>
        ) : (
          STATIC_TERMS
        )}
      </div>
    </div>
  );
}
