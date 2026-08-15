import type { ReactNode } from "react";
import SiteHeader from "@/components/xamxam/SiteHeader";
import SiteFooter from "@/components/xamxam/SiteFooter";

export default function XamXamSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
