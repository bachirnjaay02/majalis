import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import WirdMahfuzView from "@/components/xamxam/WirdMahfuzView";
import wirdMahfuzData from "@/lib/xamxam/wird-mahfuz-data.json";

export const metadata: Metadata = {
  title: "Majalis — Wird Mahfuz",
};

export default function WirdMahfuzPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <AnimatedSection>
        <Link
          href="/xamxam/wirds"
          className="text-xs font-medium text-[#8a6420] hover:underline dark:text-[#f3d27a]"
        >
          ← Tous les wirds
        </Link>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
          Wird Mahfuz
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          الورد المحفوظ
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60 md:text-base">
          Reçu par Serigne Touba Cheikh Ahmadou Bamba, ce wird se récite en
          trois formes : Al Xafiif (courte), Al Kaamil (complète) et Al
          Xaatam (le sceau). Choisissez une version ci-dessous.
        </p>
      </AnimatedSection>

      <div className="mt-8">
        <WirdMahfuzView data={wirdMahfuzData} />
      </div>

      <p className="mt-10 text-center text-xs text-[#241d14]/40 dark:text-[#f3e9d2]/40">
        Source : wirdmaaxuuz.com
      </p>
    </div>
  );
}
