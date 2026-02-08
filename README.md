# Prof. Dr. Esra Yürümez - Web Sitesi

Next.js 14 (App Router), TypeScript ve Tailwind ile üretim odaklı, çocuk ve ergen psikiyatrisi temasına uygun web sitesi.

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve doldurun:

```bash
cp .env.example .env
```

**.env** içeriği:

- `DATABASE_URL`: SQLite için `file:./dev.db` (yerel). Production için PostgreSQL bağlantı dizesi kullanın.
- `SESSION_SECRET`: En az 32 karakter, güçlü rastgele bir anahtar (admin oturumu için).
- `ADMIN_USER`: Admin paneline giriş kullanıcı adı.
- `ADMIN_PASS_HASH`: Şifrenin bcrypt hash’i (aşağıda üretme komutu).
- `SITE_URL`: Canlı site URL’i (örn. `https://esrayurumez.com`). Yerel için `http://localhost:3000`.

**Admin şifre hash’i üretmek** (Node ile):

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('SECRET_PASSWORD', 10));"
```

Çıktıyı `ADMIN_PASS_HASH` olarak `.env` içine yapıştırın.

### 3. Veritabanı

SQLite (yerel):

```bash
npx prisma db push
npx prisma generate
```

Production’da PostgreSQL kullanacaksanız `schema.prisma` içinde:

- `provider = "sqlite"` → `provider = "postgresql"`
- `DATABASE_URL` değerini PostgreSQL bağlantı dizesi yapın.

Sonra:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Blogları (docx) siteye ekleme

Tüm blog yazılarınız `esrayurumez-files/blogs/` içindeki **.docx** dosyalarından gelir. Bunları veritabanına aktarmak için (Supabase’e veya kullandığınız veritabanına erişim gerekir):

```bash
npm run db:seed
```

- Bu komut `esrayurumez-files/blogs/` içindeki tüm .docx dosyalarını okur, HTML’e çevirir ve veritabanına yazar.
- **İnternet bağlantısı** ve **doğru DATABASE_URL** (.env veya .env.local) gerekir. Supabase kullanıyorsanız projenin açık ve şifrenin doğru olduğundan emin olun.
- Seed’i kendi bilgisayarınızda, proje klasöründe çalıştırın. Başarılı olursa terminalde "Created post: ..." veya "Updated post: ..." mesajlarını görürsünüz.

### 5. Logo

Logo dosyalarını `esrayurumez-files/logo/` içinden `public/logo/` klasörüne kopyalayın:

```bash
cp esrayurumez-files/logo/logo.png public/logo/
cp esrayurumez-files/logo/logo.svg public/logo/
```

### 6. Yerel çalıştırma

```bash
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## Sayfalar

| Rota | Açıklama |
|------|----------|
| `/` | Anasayfa |
| `/hakkimda` | Hakkımda ve Özgeçmiş |
| `/bilimsel-calismalar` | Özgeçmiş docx’ten çıkarılan bilimsel çalışmalar bölümü |
| `/galeri` | Fotoğraf galerisi (`esrayurumez-files/photos/`) |
| `/blog` | Blog listesi |
| `/blog/[slug]` | Blog yazısı + yorumlar |
| `/iletisim` | İletişim formu, WhatsApp, harita |
| `/gizlilik-politikasi` | Gizlilik metni |
| `/kullanim-sartlari` | Kullanım şartları |
| `/admin` | Admin girişi (sadece siz) |

## Admin paneli (/admin)

- Giriş: `.env` içindeki `ADMIN_USER` ve `ADMIN_PASS_HASH` ile.
- **Yazılar**: .docx yükleme, yayınla / yayından kaldırma.
- **Yorumlar**: Onaylama, spam işaretleme, silme.
- **Site ayarları**: Hero metni, iletişim bilgileri, WhatsApp, Instagram, harita embed, gizlilik ve kullanım şartları metinleri.

## Production build

```bash
npm run build
npm run start
```

## Vercel’e deploy

1. Repoyu Vercel’e bağlayın.
2. **Environment Variables** ekleyin:
   - `DATABASE_URL` (Vercel Postgres veya harici PostgreSQL)
   - `SESSION_SECRET`
   - `ADMIN_USER`
   - `ADMIN_PASS_HASH`
   - `SITE_URL` (örn. `https://esrayurumez.com`)
3. Build komutu: `npm run build`
4. Install: `npm install`
5. PostgreSQL kullanıyorsanız: `prisma migrate deploy` (veya Vercel’in Postgres eklentisi ile otomatik).

**Not:** SQLite Vercel’de kalıcı depolama sağlamaz; production için PostgreSQL (veya uyumlu bir veritabanı) kullanın.

## Proje yapısı (özet)

- `app/` – Sayfalar ve API route’ları
- `src/components/` – React bileşenleri (Header, Footer, formlar, admin UI)
- `src/lib/` – Prisma, auth, docx parse, slugify, sanitize, rate-limit, site ayarları
- `prisma/` – Schema ve seed
- `esrayurumez-files/` – İçerik (blogs, photos, logo, hakkımda, özgeçmiş)

## Notlar

- Blog yazıları şu an **.docx** ile çalışır. .pages dosyalarını Word’e aktarıp .docx olarak kaydedin, sonra `npm run db:seed` çalıştırın.
- Bilimsel Çalışmalar sayfası, `esrayurumez-files/özgeçmiş/` içindeki **.docx** özgeçmiş dosyasından “Bilimsel Çalışmalar” / “Yayınlar” benzeri başlığı bularak o bölümü gösterir. Özgeçmiş .docx ise çalışır.
- Hakkımda metni `esrayurumez-files/hakkımda/` içindeki .docx’ten okunur veya admin panelinden “Site ayarları” ile düzenlenebilir (aboutBlocks).
