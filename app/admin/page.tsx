import { redirect } from "next/navigation";
import { isAdmin } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (await isAdmin()) redirect("/admin/dashboard");
  redirect("/admin/login");
}
