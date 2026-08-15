import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { XamXamLanguage } from "@prisma/client";
import BookCard from "@/components/xamxam/BookCard";
import LibraryFilters from "@/components/xamxam/LibraryFilters";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export const metadata: Metadata = {
  title: "Majalis — Les livres",
};

const validLanguages = new Set(["WOLOF", "FRANCAIS", "ARABE"]);

export default async function LivresPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string; categorie?: string }>;
}) {
  const { lang, q, categorie } = await searchParams;

  const [books, categories] = await Promise.all([
    prisma.xamXamBook.findMany({
      where: {
        ...(lang && validLanguages.has(lang)
          ? { language: lang as XamXamLanguage }
          : {}),
        ...(categorie ? { category: categorie } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { category: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.xamXamBook
      .findMany({
        distinct: ["category"],
        select: { category: true },
        where: { category: { not: null } },
      })
      .then((rows) => rows.map((r) => r.category).filter((c): c is string => !!c)),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <AnimatedSection>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
          Majalis
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          Les livres de Serigne Touba
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60 md:text-base">
          Parcourez et filtrez les écrits de Cheikh Ahmadou Bamba en wolof,
          français et arabe. Chaque livre s&apos;ouvre en PDF dans un nouvel
          onglet.
        </p>
      </AnimatedSection>

      <div className="mt-8">
        <LibraryFilters categories={categories} />
      </div>

      {books.length === 0 ? (
        <p className="mt-16 text-center text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
          Aucun livre ne correspond à votre recherche pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book, i) => (
            <AnimatedSection key={book.id} delay={Math.min(i * 0.04, 0.3)}>
              <BookCard book={book} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
