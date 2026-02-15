# Production Health Check Raporu — Esra Yürümez Web Sitesi

**Tarih:** 8 Şubat 2025  
**Hedef:** Vercel üzerinde canlı production sitesi (tıbbi profesyonel, özel domain)  
**Kapsam:** Build, domain, SSL, performans, SEO, erişilebilirlik, içerik/UX, hata yönetimi

---

## 1. BUILD & DEPLOYMENT

**Durum: OK (uyarılar var)**

### Doğrulananlar
- **Framework:** Next.js 14.2.15 doğru tespit ediliyor; App Router kullanılıyor.
- **Build:** `npm run build` başarıyla tamamlanıyor (bağımlılıklar yüklüyken). Tüm sayfalar `ƒ` (dynamic) veya `○` (static) olarak üretiliyor.
- **Output:** Tüm sayfalar `force-dynamic` veya API route; static export yok, sunucu taraflı render doğru.
- **Geliştirme sızıntısı:** `NODE_ENV` ve `process.env.VERCEL` yalnızca uygun yerlerde kullanılıyor (auth secure cookie, Prisma log, dev-only ADMIN_PASS). Production’da development-only config sızıntısı yok.
- **postinstall:** `prisma generate` tanımlı; Vercel deploy’da Prisma Client üretiliyor.

### Uyarılar

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **Environment variables** | Build sırasında DB’ye bağlanan sayfalar (layout, anasayfa, blog listesi vb.) `DATABASE_URL` olmadan veya hatalı SSL ile Prisma hatası verebilir. Lokal build’de "Error opening a TLS connection: bad certificate format" görüldü. | Vercel’de `DATABASE_URL` yanlış/eksikse build veya runtime hataları. | Vercel Environment Variables’da `DATABASE_URL` (ve gerekirse `DIRECT_URL`) doğru ve production SSL ayarlarıyla tanımlı olsun. Build’de DB erişimi kullanılıyorsa Vercel’in build ortamında bu değişkenlerin varlığını doğrulayın. |
| **Eksik env dokümantasyonu** | `.env.example` içinde production için zorunlu değişkenler (örn. `SITE_URL`, `SESSION_SECRET`, `DATABASE_URL`) açıkça “production’da zorunlu” olarak listelenmemiş. | Yeni deploy veya farklı ortamda eksik env ile site bozuk çalışabilir. | `.env.example` veya README’de “Production (Vercel) için zorunlu: SITE_URL, DATABASE_URL, SESSION_SECRET, (SMTP isteğe bağlı)” gibi bir bölüm ekleyin. |
| **next.config images** | `unoptimized: process.env.VERCEL ? false : false` her zaman `false`; yani Vercel’de image optimization açık. Mantık gereksiz ama davranış doğru. | Düşük: sadece okunabilirlik. | İsterseniz `unoptimized: false` yaparak sadeleştirin. |

### Eksik / Dikkat Edilmesi Gerekenler
- **SITE_URL:** Production’da mutlaka ayarlanmalı (örn. `https://esrayurumez.com.tr`). Sitemap ve robots bu değere göre URL üretiyor. Aşağıda “Domain & SEO” bölümünde fallback de ele alındı.

---

## 2. DOMAIN & ROUTING

**Durum: WARNING (Vercel + kod tarafı netleştirilmeli)**

### Doğrulananlar
- Projede `vercel.json` yok; domain, redirect ve SSL tamamen Vercel dashboard üzerinden yönetiliyor.
- Tüm sayfalar App Router ile tanımlı; bilinen route’lar için 404 beklenmiyor.
- `not-found.tsx` mevcut; `notFound()` çağrılan yerlerde (örn. blog `[slug]`) özel 404 sayfası gösteriliyor.

### Uyarılar / Yapılması Gerekenler

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **www ↔ apex** | www’den apex’e veya apex’ten www’ye yönlendirme proje dosyalarında yok; Vercel’e bırakılmış. | Vercel’de yanlış ayar varsa çift içerik veya karışık canonical. | Vercel Project → Settings → Domains’te tek bir canonical domain seçin (örn. apex veya www). Diğerini buna yönlendirin. |
| **HTTPS zorunluluğu** | Kod tarafında HTTP→HTTPS redirect’i yok; Vercel varsayılan olarak HTTPS sunar. | Vercel zaten HTTPS zorunlu yapıyor; ek risk yok. | Vercel’in “Force HTTPS” ayarının açık olduğundan emin olun (genelde varsayılan). |
| **SITE_URL fallback** | `app/sitemap.ts` ve `app/robots.ts` içinde `BASE = process.env.SITE_URL ?? "https://esrayurumez.com"`. Gerçek domain `esrayurumez.com.tr` ise fallback yanlış (.tr eksik). | Env bir şekilde yoksa sitemap/robots yanlış domain’e işaret eder; SEO ve canonical karışır. | Production’da `SITE_URL`’i Vercel’de mutlaka set edin. Fallback’i gerçek production domain ile güncelleyin (örn. `https://esrayurumez.com.tr`). |

### Önerilen `vercel.json` (isteğe bağlı)
Domain yönlendirmelerini kodda da tutmak isterseniz (Vercel bu kuralları merge eder):

```json
{
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

Apex/www tercihi Vercel Domains ayarından yapılmalı; redirect loop’ları önlemek için tek canonical domain kullanın.

---

## 3. SSL & SECURITY

**Durum: OK (header iyileştirmesi önerilir)**

### Doğrulananlar
- SSL: Vercel otomatik TLS sağlar; custom domain’de certificate otomatik yönetilir.
- **Cookie:** `iron-session` ile `secure: process.env.NODE_ENV === "production"`, `httpOnly: true`, `sameSite: "lax"` doğru.
- **Auth:** Admin girişi bcrypt + session; development’ta düz metin şifre sadece `NODE_ENV === "development"` ile kullanılıyor; production’da hash kullanılıyor.
- **robots.txt:** `/admin` ve `/api/admin` disallow; arama motorları admin’i taramaz.

### Eksik / Öneriler

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **Güvenlik başlıkları** | Projede `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` vb. tanımlı değil. | Clickjacking, MIME sniffing; düşük ama best practice. | Yukarıdaki `vercel.json` headers’ı ekleyin veya `next.config.js` içinde `headers()` ile aynı başlıkları ekleyin. |
| **Mixed content** | Tüm içerik aynı origin veya güvenli kaynaklardan; harita iframe’i `referrerPolicy="no-referrer-when-downgrade"` ile verilmiş. | Şu an tespit edilen mixed content yok. | Harita URL’inin HTTPS olduğundan emin olun (site ayarlarından). |

---

## 4. PERFORMANCE

**Durum: WARNING (font ve görsel optimizasyonu)**

### Doğrulananlar
- **next/image:** Header, ProfileSection, BlogCard, GalleryGrid `next/image` kullanıyor; `sizes` ve `priority` (anasayfa profil) doğru kullanılmış.
- **Lazy loading:** İframe’de `loading="lazy"` var.
- **First Load JS:** Paylaşılan chunk ~87 kB; sayfa bazlı ek yük makul (ör. anasayfa ~101 kB).

### Uyarılar

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **Font yükleme** | `globals.css`’te `--font-poppins` ve `--font-figtree` tanımlı; yorumda “Google Fonts için layout’a link ekleyebilirsiniz” yazıyor ama layout’ta `<link>` yok. Fontlar yüklenmiyorsa fallback `system-ui` kullanılıyor. | FOUT veya tasarım tutarsızlığı; marka tipografisi eksik. | `app/layout.tsx` `<head>` içine Google Fonts link’i ekleyin: `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />` veya Next.js `next/font` (Google) ile preload edin. |
| **BlogCard unoptimized** | `BlogCard` içinde `<Image … unoptimized />` kullanılıyor; cover görselleri Vercel Image Optimization’dan geçmiyor. | Gereksiz büyük görsel boyutu; LCP ve bandwidth. | Mümkünse `unoptimized` kaldırın; görsel URL’leri `next/image` ile uyumlu (internal veya remotePatterns) olsun. Remote ise `next.config.js` `images.domains`/`remotePatterns` ekleyin. |
| **Core Web Vitals** | Kod incelemesiyle LCP/CLS/INP ölçülmez. | Gerçek kullanıcı metrikleri bilinmiyor. | Vercel Analytics veya Google Search Console / PageSpeed Insights ile LCP, CLS, INP ölçün; gerekirse görsel ve font optimizasyonunu buna göre iyileştirin. |

---

## 5. SEO & META

**Durum: ISSUE (canonical, OG image, Twitter; fallback domain)**

### Doğrulananlar
- **Root metadata:** `layout.tsx`’te title template, description, keywords, authors, openGraph type ve locale tanımlı.
- **Sayfa bazlı:** Hakkımda, iletişim vb. sayfalarda `metadata` export’u var; blog `[slug]` için `generateMetadata` ile title, description, openGraph title/description üretiliyor.
- **Yapısal veri:** Blog yazılarında Article schema (headline, description, datePublished, dateModified, author) mevcut.
- **sitemap.xml:** Statik sayfalar + yayınlanmış blog slug’ları; DB hata verirse sadece statik sayfalar dönüyor (güvenli).
- **robots.txt:** Allow `/`, disallow `/admin`, `/api/admin`, sitemap URL’i BASE’e bağlı.

### Sorunlar ve Öneriler

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **Canonical URL** | Hiçbir sayfada `metadataBase` veya sayfa bazlı `alternates.canonical` yok. | Çift içerik (www/apex, trailing slash) arama motorunda karışıklık. | `layout.tsx` metadata’ya `metadataBase: new URL(process.env.SITE_URL ?? "https://esrayurumez.com.tr")` ekleyin. Önemli sayfalarda `alternates: { canonical: "/hakkimda" }` gibi canonical verin. |
| **Open Graph image / URL** | Root `openGraph`’ta `url`, `siteName`, `images` yok; blog’da `og:image` yok. | Paylaşımlarda yanlış/generic önizleme veya eksik görsel. | En azından default bir `og:image` (örn. logo veya profil) ekleyin. `openGraph.url` ve `openGraph.siteName` set edin. Blog için `generateMetadata`’da cover veya default image ile `openGraph.images` ekleyin. |
| **Twitter Card** | `twitter:card`, `twitter:title` vb. yok. | Twitter/X paylaşımlarında zayıf önizleme. | `metadata`’ya `twitter: { card: "summary_large_image", title: … }` ekleyin (ve gerekirse OG ile aynı görsel). |
| **SITE_URL fallback** | Sitemap/robots BASE fallback’i `https://esrayurumez.com` (.tr yok). | Yanlış domain’e işaret; SEO ve canonical. | Fallback’i production domain ile değiştirin (örn. `https://esrayurumez.com.tr`) ve production’da `SITE_URL`’i her zaman set edin. |

---

## 6. ACCESSIBILITY

**Durum: WARNING (alt metin ve başlık hiyerarşisi)**

### Doğrulananlar
- **Dil:** `<html lang="tr">` doğru.
- **Odak:** `*:focus-visible` ile outline tanımlı (globals.css).
- **İframe:** İletişim sayfasındaki harita iframe’inde `title="Harita"` var.
- **Header/ProfileSection:** Logo ve profil fotoğrafında anlamlı `alt="Prof. Dr. Esra Yürümez"`.
- **Lightbox/GalleryGrid:** `alt={img.alt}` kullanılıyor; galeri kaynağında `alt` dolu olmalı.

### Uyarılar

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **BlogCard cover image** | `alt=""` kullanılıyor; görsel içeriğe giden linkin parçası. | Ekran okuyucu kullanıcıları görselin ne olduğunu bilmez; bağlam kaybı. | En azından `alt={title}` veya “Yazı: {title}” gibi anlamlı bir metin verin; görsel dekoratif değilse boş bırakmayın. |
| **Başlık hiyerarşisi** | Tüm sayfalar tek tek taranmadı; genel yapıda H1’in sayfa başına bir kez, H2’lerin mantıksal sırayla kullanılması önerilir. | H1 atlanması veya birden fazla H1, erişilebilirlik ve SEO. | Her sayfada tek bir anlamlı H1 olduğundan emin olun; H2 → H3 sırasını bozmayın. |
| **Form etiketleri** | ContactForm, CommentForm vb. bileşenlerde `<label>` ve `htmlFor` ilişkisi kod incelemesinde tam doğrulanmadı. | Eksik label’lar erişilebilirlik uyarısı. | Form alanlarının hepsinde görünür veya screen-reader-only label’ların ve `id`/`htmlFor` eşleşmesinin olduğunu kontrol edin (manuel veya axe/Lighthouse). |

---

## 7. CONTENT & UX RISKS

**Durum: OK (birkaç nokta kontrol edilmeli)**

### Doğrulananlar
- Ana sayfa, hakkımda, iletişim, blog, galeri, bilimsel çalışmalar, gizlilik, kullanım şartları ve admin sayfaları tanımlı; placeholder metin taraması yapılmadı ama yapı sağlam.
- Hata durumunda “Hakkımda içeriği yüklenemedi” gibi kullanıcıya yönelik mesajlar var.
- Galeri `esrayurumez-files/photos` veya API’den geliyor; dosya yoksa boş liste makul.

### Öneriler
- **Placeholder:** “Lorem ipsum”, “Test”, “TODO” gibi ifadeler için proje genelinde grep yapın; varsa production’dan kaldırın.
- **Mobil:** Tailwind kullanıldığı için responsive sınıflar var; kritik sayfaları gerçek cihaz veya tarayıcı responsive modunda test edin.
- **Harita:** İletişim sayfasında `mapUrl` yoksa harita bloku render edilmiyor; UX açısından doğru.

---

## 8. ERROR HANDLING & EDGE CASES

**Durum: OK (production’da console.error davranışı isteğe bağlı iyileştirilebilir)**

### Doğrulananlar
- **404:** `app/not-found.tsx` var; “404”, “Anasayfaya dön” linki ve root layout içinde render.
- **Blog slug:** Yazı yoksa `notFound()` çağrılıyor; 404 sayfası gösteriliyor.
- **Error boundary:** `app/error.tsx` client component; “Bir hata oluştu”, “Tekrar dene” ve “Anasayfaya dön” sunuyor; kullanıcı deneyimi uygun.
- **Sitemap:** DB hatası durumunda try/catch ile sadece statik sayfalar dönülüyor; build/runtime çökmez.

### Uyarı

| Konu | Açıklama | Risk | Öneri |
|------|----------|------|--------|
| **console.error in production** | `error.tsx` içinde `useEffect` ile `console.error(error)` çağrılıyor. | Hassas stack trace veya detay kullanıcı tarafında görünmez ama tarayıcı konsolunda görülebilir; kurumsal ortamda log’ların sunucuya gitmesi tercih edilebilir. | İsteğe bağlı: `NODE_ENV === "production"` ise `console.error` çağırma veya sadece digest log’la; gerçek hata raporlamayı sunucu tarafta (örn. error logging servisi) toplayın. |

---

## ÖZET TABLO

| Bölüm              | Durum   | Kritik aksiyon |
|--------------------|---------|----------------|
| 1. Build & Deploy  | OK      | Production’da DATABASE_URL ve SITE_URL doğru olsun; .env.example’ı güncelleyin. |
| 2. Domain & Routing| WARNING | SITE_URL fallback’i düzeltin; Vercel’de www/apex ve HTTPS netleştirin. |
| 3. SSL & Security  | OK      | Güvenlik başlıkları için vercel.json veya next.config headers ekleyin. |
| 4. Performance     | WARNING | Font’u yükleyin; BlogCard’da unoptimized’ı kaldırın; CWV ölçün. |
| 5. SEO & Meta      | ISSUE   | metadataBase/canonical, OG image/url/siteName, Twitter card ekleyin; SITE_URL fallback düzeltin. |
| 6. Accessibility   | WARNING | BlogCard alt metnini düzeltin; form label ve H1/H2 hiyerarşisini doğrulayın. |
| 7. Content & UX    | OK      | Placeholder taraması ve mobil test önerilir. |
| 8. Error Handling  | OK      | İsteğe bağlı: production’da console.error davranışını sadeleştirin. |

---

## HEMEN UYGULANABİLİR DÜZELTMELER

1. **SITE_URL fallback:** `app/sitemap.ts` ve `app/robots.ts` içinde `"https://esrayurumez.com"` → `"https://esrayurumez.com.tr"` (veya gerçek production domain).
2. **BlogCard alt:** `alt=""` → `alt={title}` veya `alt={`Yazı: ${title}`}`.
3. **Layout’a font linki:** `app/layout.tsx` `<head>` içine Google Fonts link’i (veya `next/font`).
4. **Metadata (layout):** `metadataBase`, `openGraph.url`, `openGraph.siteName`, varsayılan `openGraph.images`; isteğe bağlı `twitter`.
5. **Güvenlik başlıkları:** `vercel.json` veya `next.config.js` ile `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.

Bu rapor, mevcut kod tabanı ve build çıktısına dayanmaktadır. Canlı domain, SSL ve redirect davranışı Vercel dashboard’dan doğrulanmalı; Core Web Vitals ve gerçek kullanıcı erişilebilirlik testi için Lighthouse/axe ve Vercel Analytics önerilir.
