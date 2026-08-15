import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getXamXamAdmin } from "@/lib/xamxam/auth";
import AdminShell from "@/components/xamxam/admin/AdminShell";

export default async function XamXamAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Defense in depth: proxy.ts already redirects unauthenticated requests
  // away from /xamxam/admin, this re-checks at the data layer.
  const admin = await getXamXamAdmin();
  if (!admin) redirect("/xamxam/admin/login");

  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
