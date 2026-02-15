import { AdminGalleryClient } from "@/src/components/AdminGalleryClient";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Galeri</h1>
      <AdminGalleryClient />
    </div>
  );
}
