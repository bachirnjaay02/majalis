import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { XamXamLanguage } from "@prisma/client";
import WirdCard from "@/components/xamxam/WirdCard";
import WirdFilters from "@/components/xamxam/WirdFilters";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export const metadata: Metadata = {
  title: "Majalis — Wirds",
};

const validLanguages = new Set(["WOLOF", "FRANCAIS", "ARABE"]);

export default async function WirdsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; moment?: string }>;
}) {
  const { lang, moment } = await searchParams;

  const [wirds, moments] = await Promise.all([
    prisma.xamXamWird.findMany({
      where: {
        ...(lang && validLanguages.has(lang)
          ? { language: lang as XamXamLanguage }
          : {}),
        ...(moment ? { moment } : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.xamXamWird
      .findMany({
        distinct: ["moment"],
        select: { moment: true },
        where: { moment: { not: null } },
      })
      .then((rows) => rows.map((r) => r.moment).filter((m): m is string => !!m)),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <AnimatedSection>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
          Wirds
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          Litanies et invocations
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60 md:text-base">
          Les wirds transmis par Serigne Touba, à réciter selon les moments
          indiqués.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <Link
          href="/xamxam/wirds/mahfuz"
          className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f3d27a]/25 bg-gradient-to-r from-[#f3d27a]/15 to-[#c9973a]/10 px-5 py-4 transition-colors hover:border-[#f3d27a]/50"
        >
          <span>
            <span className="font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f3e9d2]">
              Wird Mahfuz — الورد المحفوظ
            </span>
            <span className="mt-0.5 block text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60">
              Les trois versions complètes (Al Xafiif, Al Kaamil, Al Xaatam), en arabe avec translittération.
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-gradient-to-r from-[#f3d27a] to-[#c9973a] px-4 py-2 text-sm font-semibold text-[#241d14]">
            Découvrir →
          </span>
        </Link>
      </AnimatedSection>

      <div className="mt-8">
        <WirdFilters moments={moments} />
      </div>

      {wirds.length === 0 ? (
        <p className="mt-16 text-center text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
          Aucun wird ne correspond à votre recherche pour le moment.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {wirds.map((wird, i) => (
            <AnimatedSection key={wird.id} delay={Math.min(i * 0.05, 0.3)}>
              <WirdCard wird={wird} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
