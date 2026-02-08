# Supabase Bağlantı (IPv4 – Session Pooler)

Direct connection (5432) IPv4 ile uyumlu değil. **Session Pooler** connection string’i kullanın.

## Pooler connection string’i nereden alınır?

Şu an açık olan sayfa **Database Settings** (şifre sıfırlama, pool size, SSL). Connection string bu sayfada değil; aşağıdaki yoldan alınır:

1. Sol menüden **Project Settings** (dişli ikonu) → **Database** sayfasına gidin.
2. Sayfada **“Connection string”** başlıklı bölümü bulun (veya **“Connect to your project”** butonuna tıklayın).
3. Açılan bölümde **Method** açılır menüsünden **“Session pooler”** veya **“Transaction pooler”** seçin (şu an muhtemelen “Direct connection” yazıyor).
4. Altında görünen **URI** otomatik değişecek; adres **pooler.supabase.com** ve port **6543** olacak. Bu **tüm satırı kopyalayın**.

## .env.local’e yapıştırma

- Connection string’te `[YOUR-PASSWORD]` geçiyorsa, yerine şifrenizi yazın. Şifre **112233Website?DB** ise URL’de **?** → **%3F** olmalı: **112233Website%3FDB**
- `.env.local` içinde `DATABASE_URL` satırını bu yeni (pooler) connection string ile değiştirin.

## Son adım

Dev sunucuyu yeniden başlatıp seed çalıştırın:

```bash
npm run dev
# Başka terminalde:
npm run db:seed
```
