"use client";

import { useState, useEffect } from "react";

type Settings = {
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
  contactPageTitle?: string;
  contactSectionInfo?: string;
  contactSectionForm?: string;
  contactSectionMap?: string;
  contactWhatsappButton?: string;
  contactDirectionsButton?: string;
  privacyPolicy?: string;
  termsOfUse?: string;
  profileTitle?: string;
  profileInstitutions?: string;
  profileWorkAreas?: string;
  footerDescription?: string;
  notificationEmail?: string;
};

const defaultSettings: Settings = {
  heroTitle: "",
  heroSubtitle: "",
  ctaText: "",
  contactPhone: "",
  contactEmail: "",
  contactAddress: "",
  instagramUrl: "",
  linkedinUrl: "",
  whatsappNumber: "",
  mapEmbedUrl: "",
  contactPageTitle: "",
  contactSectionInfo: "",
  contactSectionForm: "",
  contactSectionMap: "",
  contactWhatsappButton: "",
  contactDirectionsButton: "",
  privacyPolicy: "",
  termsOfUse: "",
  profileTitle: "",
  profileInstitutions: "",
  profileWorkAreas: "",
  footerDescription: "",
  notificationEmail: "",
};

export function AdminSettingsClient() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) setMessage("Kaydedildi.");
      else setMessage("Kaydedilemedi.");
    } catch {
      setMessage("Bağlantı hatası.");
    }
    setSaving(false);
  }

  if (loading) return <p className="text-text-main/70">Yükleniyor...</p>;

  return (
    <div className="space-y-8 max-w-2xl">
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">Anasayfa</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Hero başlık</label>
            <input
              type="text"
              value={settings.heroTitle ?? ""}
              onChange={(e) => update("heroTitle", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Hero alt metin</label>
            <textarea
              rows={2}
              value={settings.heroSubtitle ?? ""}
              onChange={(e) => update("heroSubtitle", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">CTA buton metni</label>
            <input
              type="text"
              value={settings.ctaText ?? ""}
              onChange={(e) => update("ctaText", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">İletişim</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Telefon</label>
            <input type="text" value={settings.contactPhone ?? ""} onChange={(e) => update("contactPhone", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">E-posta</label>
            <input type="email" value={settings.contactEmail ?? ""} onChange={(e) => update("contactEmail", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Adres</label>
            <input type="text" value={settings.contactAddress ?? ""} onChange={(e) => update("contactAddress", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">WhatsApp numara (örn. 905XXXXXXXXX)</label>
            <input type="text" value={settings.whatsappNumber ?? ""} onChange={(e) => update("whatsappNumber", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Instagram URL</label>
            <input type="url" value={settings.instagramUrl ?? ""} onChange={(e) => update("instagramUrl", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">LinkedIn URL (isteğe bağlı)</label>
            <input type="url" value={settings.linkedinUrl ?? ""} onChange={(e) => update("linkedinUrl", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Google Maps embed URL (İletişim sayfası haritası)</label>
            <textarea rows={2} value={settings.mapEmbedUrl ?? ""} onChange={(e) => update("mapEmbedUrl", e.target.value)} className="w-full px-4 py-2 rounded-lg border font-mono text-sm" placeholder="Google Maps Paylaş → Harita yerleştir ile alınan iframe src adresi" />
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-text-main/90 mb-2">İletişim sayfası metinleri</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-main/80 mb-1">Sayfa başlığı</label>
                <input type="text" value={settings.contactPageTitle ?? ""} onChange={(e) => update("contactPageTitle", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="İletişim" />
              </div>
              <div>
                <label className="block text-sm text-text-main/80 mb-1">Bölüm: İletişim bilgileri başlığı</label>
                <input type="text" value={settings.contactSectionInfo ?? ""} onChange={(e) => update("contactSectionInfo", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="İletişim Bilgileri" />
              </div>
              <div>
                <label className="block text-sm text-text-main/80 mb-1">Bölüm: Form başlığı (Randevu / Mesaj)</label>
                <input type="text" value={settings.contactSectionForm ?? ""} onChange={(e) => update("contactSectionForm", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Randevu / Mesaj" />
              </div>
              <div>
                <label className="block text-sm text-text-main/80 mb-1">Bölüm: Harita başlığı</label>
                <input type="text" value={settings.contactSectionMap ?? ""} onChange={(e) => update("contactSectionMap", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Konum" />
              </div>
              <div>
                <label className="block text-sm text-text-main/80 mb-1">WhatsApp buton metni</label>
                <input type="text" value={settings.contactWhatsappButton ?? ""} onChange={(e) => update("contactWhatsappButton", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="WhatsApp ile Yaz" />
              </div>
              <div>
                <label className="block text-sm text-text-main/80 mb-1">Yol tarifi buton metni</label>
                <input type="text" value={settings.contactDirectionsButton ?? ""} onChange={(e) => update("contactDirectionsButton", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Yol tarifi al" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">Anasayfa Profil</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Unvan (örn. Bebek, Çocuk ve Ergen Psikiyatristi Uzmanı)</label>
            <input type="text" value={settings.profileTitle ?? ""} onChange={(e) => update("profileTitle", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Kurumlar (her satır bir madde)</label>
            <textarea rows={4} value={settings.profileInstitutions ?? ""} onChange={(e) => update("profileInstitutions", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Ankara Üniversitesi Tıp Fakültesi&#10;Çocuk ve Ergen Ruh Sağlığı..." />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Çalışma alanları (her satır bir madde)</label>
            <textarea rows={6} value={settings.profileWorkAreas ?? ""} onChange={(e) => update("profileWorkAreas", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Otizm spektrum bozuklukları&#10;Aile danışmanlığı..." />
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">Bildirimler</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Yorum bildirim e-postası</label>
            <input
              type="email"
              value={settings.notificationEmail ?? ""}
              onChange={(e) => update("notificationEmail", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              placeholder="emrerbay.st@gmail.com"
            />
            <p className="text-xs text-text-main/60 mt-1">Blog veya anasayfa yorumu gelince bu adrese e-posta gider. SMTP .env’de tanımlı olmalı.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">Footer</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Footer kısa açıklama</label>
            <textarea rows={2} value={settings.footerDescription ?? ""} onChange={(e) => update("footerDescription", e.target.value)} className="w-full px-4 py-2 rounded-lg border" placeholder="Çocuk ve Ergen Ruh Sağlığı alanında..." />
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-heading font-medium text-lg mb-3">Gizlilik & Kullanım</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Gizlilik politikası metni</label>
            <textarea rows={6} value={settings.privacyPolicy ?? ""} onChange={(e) => update("privacyPolicy", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label className="block text-sm text-text-main/80 mb-1">Kullanım şartları metni</label>
            <textarea rows={6} value={settings.termsOfUse ?? ""} onChange={(e) => update("termsOfUse", e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
          </div>
        </div>
      </section>
      {message && <p className={message === "Kaydedildi." ? "text-primary font-medium" : "text-red-600"}>{message}</p>}
      <button type="button" onClick={save} disabled={saving} className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50">
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </div>
  );
}
