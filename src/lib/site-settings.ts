import { prisma } from "./db";

export interface SiteSettingsMap {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  mapEmbedUrl?: string;
  aboutBlocks?: string; // JSON array of { title, content }
  privacyPolicy?: string;
  termsOfUse?: string;
  /** Anasayfa profil: unvan (örn. Bebek, Çocuk ve Ergen Psikiyatrisi Uzmanı) */
  profileTitle?: string;
  /** Kurumlar, satır satır (her satır bir madde) */
  profileInstitutions?: string;
  /** Çalışma alanları, satır satır */
  profileWorkAreas?: string;
  /** Footer kısa açıklama */
  footerDescription?: string;
  /** Yorum / misafir defteri bildirimi gönderilecek e-posta (admin’den düzenlenebilir) */
  notificationEmail?: string;
  /** Galeriden kaldırılan (gizlenen) klasör görselleri – dosya adları */
  galleryHiddenFiles?: string[];
}

/** Ankara Üniversitesi Tıp Fakültesi Cebeci Hastanesi, Mamak/Ankara — harita boş bırakılırsa bu kullanılır */
export const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.21826171875!2d32.871017!3d39.930982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU1JzUxLjUiTiAzMsKwNTInMjEuNiJF!5e0!3m2!1str!2str!4v1707123456";

const DEFAULTS: SiteSettingsMap = {
  heroTitle: "Prof. Dr. Esra Yürümez",
  heroSubtitle: "Çocuk ve Ergen Ruh Sağlığı uzmanı olarak ailelere ve gençlere yönelik bilimsel, empatik ve güvenilir destek sunuyorum.",
  ctaText: "Randevu Talep Et",
  contactPhone: "0312 595 7978",
  contactEmail: "esrayurumez@gmail.com",
  contactAddress: "Ankara Üniversitesi Tıp Fakültesi Çocuk ve Ergen Ruh Sağlığı ve Hastalıkları Anabilim Dalı, Ankara Tıp Cebeci Hastanesi, Mamak, Ankara",
  instagramUrl: "https://www.instagram.com/prof.dr.esrayurumez/",
  linkedinUrl: "",
  whatsappNumber: "905068619439",
  mapEmbedUrl: DEFAULT_MAP_EMBED,
  aboutBlocks: "[]",
  privacyPolicy: "",
  termsOfUse: "",
  profileTitle: "Bebek, Çocuk ve Ergen Psikiyatrisi Uzmanı",
  profileInstitutions: "Ankara Üniversitesi Tıp Fakültesi\nÇocuk ve Ergen Ruh Sağlığı ve Hastalıkları Anabilim Dalı Öğretim Üyesi\nAnkara Üniversitesi Psikiyatri Otizm Araştırma ve Uygulama Merkezi Yönetim Kurulu Üyesi",
  profileWorkAreas: "Bebek, çocuk ve ergen ruh sağlığı değerlendirme ve tedavisi\nOtizm spektrum bozuklukları\nAile danışmanlığı ve ebeveyn destek programları\nOkul çağı çocuklarında davranış ve dikkat sorunları\nErgenlerde kaygı, depresyon ve kimlik gelişimi",
  footerDescription: "Çocuk ve Ergen Ruh Sağlığı alanında bilimsel ve empatik destek.",
  notificationEmail: "emrerbay.st@gmail.com",
  galleryHiddenFiles: [],
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map: SiteSettingsMap = { ...DEFAULTS };
    for (const r of rows) {
      try {
        (map as Record<string, unknown>)[r.key] = JSON.parse(r.value);
      } catch {
        (map as Record<string, unknown>)[r.key] = r.value;
      }
    }
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function setSiteSetting(key: keyof SiteSettingsMap, value: unknown): Promise<void> {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  await prisma.siteSettings.upsert({
    where: { key },
    create: { key, value: str },
    update: { value: str },
  });
}
