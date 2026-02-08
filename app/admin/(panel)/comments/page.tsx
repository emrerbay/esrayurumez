import { AdminCommentsClient } from "@/src/components/AdminCommentsClient";

export default function AdminCommentsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Yorumlar</h1>
      <AdminCommentsClient />
    </div>
  );
}
