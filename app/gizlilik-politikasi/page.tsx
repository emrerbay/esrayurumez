import type { Metadata } from "next";
import { getSiteSettings } from "@/src/lib/site-settings";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Prof. Dr. Esra Yürümez web sitesi gizlilik politikası ve kişisel verilerin korunması.",
};

export const dynamic = "force-dynamic";

const STATIC_POLICY = (
  <>
    <p className="text-text-main/80 mb-6">
      Son güncelleme: Şubat 2025. Bu gizlilik politikası,{" "}
      <strong>Prof. Dr. Esra Yürümez</strong> (“biz”, “bizim”) olarak bu web sitesini ziyaret edenlerin
      kişisel verilerinin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır. 6698 sayılı
      Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında bilgilendirme yapılmaktadır.
    </p>

    <h2>1. Veri Sorumlusu</h2>
    <p>
      Kişisel verileriniz; veri sorumlusu sıfatıyla Prof. Dr. Esra Yürümez (Ankara Üniversitesi Tıp
      Fakültesi Çocuk ve Ergen Ruh Sağlığı ve Hastalıkları Anabilim Dalı) tarafından işlenmektedir.
      İletişim: esrayurumez@gmail.com
    </p>

    <h2>2. Toplanan Veriler ve Amaçları</h2>
    <p>
      Aşağıdaki kişisel veriler, belirtilen amaçlarla ve yalnızca hizmet sunumu için gerekli olduğu
      ölçüde toplanabilir:
    </p>
    <ul>
      <li>
        <strong>İletişim formu:</strong> Ad, e-posta, telefon, mesaj içeriği — randevu veya bilgi
        taleplerinize yanıt vermek amacıyla.
      </li>
      <li>
        <strong>Yorum ve anasayfa yorum (misafir defteri) formları:</strong> Ad, e-posta (isteğe bağlı),
        yorum metni — site üzerinde yayımlanabilecek görüş ve yorumlarınızı kaydetmek amacıyla.
      </li>
      <li>
        <strong>Teknik veriler:</strong> IP adresi (hash’lenmiş olarak, spam önleme için), tarayıcı
        türü, cihaz bilgisi — güvenlik ve site işleyişi için.
      </li>
    </ul>

    <h2>3. Hukuki Sebep ve Saklama Süresi</h2>
    <p>
      Verileriniz; açık rızanız, sözleşmenin ifası veya meşru menfaat (ör. güvenlik, hizmet kalitesi)
      gibi KVKK 5. maddesindeki hukuki sebeplere dayanılarak işlenir. İletişim ve yorum verileri,
      yasal zorunluluklar ve talep yanıtı süreleri dikkate alınarak sınırlı süre saklanır; ardından
      silinir veya anonim hale getirilir.
    </p>

    <h2>4. Verilerin Aktarılması</h2>
    <p>
      Kişisel verileriniz, yalnızca yasal zorunluluk (mahkeme, kolluk talebi vb.) veya hizmet
      sağlayıcılarımızla (ör. barındırma, e-posta) sözleşmesel güvenlik önlemleri altında paylaşım
      durumunda üçüncü taraflara aktarılabilir. Ticari amaçla satılmaz veya reklam için
      kullanılmaz.
    </p>

    <h2>5. Haklarınız (KVKK 11)</h2>
    <p>
      Kişisel verilerinizle ilgili olarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
      buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını
      öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü tarafları bilme, eksik veya yanlış
      işlenmişse düzeltilmesini isteme, KVKK 7. maddede öngörülen şartlar çerçevesinde silinmesini
      veya yok edilmesini isteme, düzeltme ve silme işlemlerinin üçüncü taraflara bildirilmesini
      isteme, münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir
      sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işlenmesi sebebiyle zarara uğramanız
      hâlinde tazminat talep etme haklarına sahipsiniz. Başvurularınızı esrayurumez@gmail.com
      adresine yazılı olarak iletebilirsiniz; yasal süre içinde yanıtlanacaktır.
    </p>

    <h2>6. Çerezler</h2>
    <p>
      Site, işlevsellik ve güvenlik için gerekli çerezleri kullanabilir (ör. oturum, güvenlik).
      Ziyaretiniz sırasında toplanan bu veriler, yalnızca site deneyimini iyileştirmek ve
      saldırıları önlemek amacıyla kullanılır. Tarayıcı ayarlarınızdan çerezleri kısıtlayabilirsiniz;
      bazı özellikler kısıtlamadan etkilenebilir.
    </p>

    <h2>7. Güvenlik</h2>
    <p>
      Verileriniz, uygun teknik ve idari önlemlerle korunur. İletişim ve form verileri güvenli
      bağlantı (HTTPS) üzerinden iletilir.
    </p>

    <h2>8. Değişiklikler ve İletişim</h2>
    <p>
      Bu gizlilik politikası güncellenebilir; önemli değişiklikler sayfada belirtilir. Sorularınız
      için: esrayurumez@gmail.com
    </p>
  </>
);

export default async function GizlilikPolitikasiPage() {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  const customContent = settings?.privacyPolicy;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-8">Gizlilik Politikası</h1>
      <div className="prose-calm">
        {typeof customContent === "string" && customContent.trim() ? (
          <div className="whitespace-pre-wrap">{customContent}</div>
        ) : (
          STATIC_POLICY
        )}
      </div>
    </div>
  );
}
