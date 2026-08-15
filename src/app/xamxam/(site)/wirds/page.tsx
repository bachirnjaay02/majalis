import type { Metadata } from "next";
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
