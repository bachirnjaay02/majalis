import type { ReactNode } from "react";
import SiteHeader from "@/components/xamxam/SiteHeader";
import SiteFooter from "@/components/xamxam/SiteFooter";
import BottomNav from "@/components/xamxam/BottomNav";

export default function XamXamSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
