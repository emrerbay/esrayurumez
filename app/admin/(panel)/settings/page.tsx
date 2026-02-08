import { AdminSettingsClient } from "@/src/components/AdminSettingsClient";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Site Ayarları</h1>
      <AdminSettingsClient />
    </div>
  );
}
