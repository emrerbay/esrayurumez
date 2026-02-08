import { redirect } from "next/navigation";
import { isAdmin } from "@/src/lib/auth";
import { AdminSidebar } from "@/src/components/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-bg-accent">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
