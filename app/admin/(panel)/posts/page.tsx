import { AdminPostsClient } from "@/src/components/AdminPostsClient";

export default function AdminPostsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-main mb-6">Yazılar</h1>
      <AdminPostsClient />
    </div>
  );
}
