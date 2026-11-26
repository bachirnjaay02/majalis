import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma, type XamXamLanguage } from "@prisma/client";
import BookCard from "@/components/xamxam/BookCard";
import LibraryFilters from "@/components/xamxam/LibraryFilters";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import { demoBooks } from "@/lib/xamxam/demo-data";
import { withFallback } from "@/lib/xamxam/safe-query";
import type { KhassaideBook } from "@/lib/xamxam/types";

export const metadata: Metadata = {
  title: "Majalis — Les livres",
};

const validLanguages = new Set(["WOLOF", "FRANCAIS", "ARABE"]);

type BookFilters = { lang?: string; q?: string; categorie?: string };

function filterDemoBooks({ lang, q, categorie }: BookFilters): KhassaideBook[] {
  const query = q?.trim().toLowerCase();
  return demoBooks.filter((book) => {
    if (lang && validLanguages.has(lang) && book.language !== (lang as XamXamLanguage)) {
      return false;
    }
    if (categorie && book.category !== categorie) return false;
    if (query) {
      const haystack = [
        book.title,
        book.arabicTitle,
        book.author,
        book.category,
        book.description,
        book.type,
        ...book.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function demoCategories(): string[] {
  return Array.from(
    new Set(demoBooks.map((book) => book.category).filter((c): c is string => !!c))
  );
}

export default async function LivresPage({
  searchParams,
}: {
  searchParams: Promise<BookFilters>;
}) {
  const { lang, q, categorie } = await searchParams;

  const where: Prisma.XamXamBookWhereInput = {
    ...(lang && validLanguages.has(lang)
      ? { language: lang as XamXamLanguage }
      : {}),
    ...(categorie ? { category: categorie } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { arabicTitle: { contains: q } },
            { category: { contains: q, mode: "insensitive" } },
            { type: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
          ],
        }
      : {}),
  };

  const [books, categories] = await Promise.all([
    withFallback<KhassaideBook[]>(
      () =>
        prisma.xamXamBook.findMany({
          where,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        }),
      filterDemoBooks({ lang, q, categorie })
    ),
    withFallback(
      () =>
        prisma.xamXamBook
          .findMany({
            distinct: ["category"],
            select: { category: true },
            where: { category: { not: null } },
          })
          .then((rows) =>
            rows.map((r) => r.category).filter((c): c is string => !!c)
          ),
      demoCategories()
    ),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <AnimatedSection>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
          Majalis
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f4ecd8] md:text-4xl">
          Les livres de Serigne Touba
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/65 dark:text-[#f4ecd8]/60 md:text-base">
          Parcourez et filtrez les écrits de Cheikh Ahmadou Bamba en wolof,
          français et arabe. Touchez une couverture pour ouvrir la fiche du
          khassaïde, ses métadonnées et ses fichiers.
        </p>
      </AnimatedSection>

      <div className="mt-8">
        <LibraryFilters categories={categories} />
      </div>

      {books.length === 0 ? (
        <div className="kx-panel mt-12 rounded-3xl p-8 text-center">
          <p className="text-sm text-[#241d14]/60 dark:text-[#f4ecd8]/60">
            Aucun livre ne correspond à votre recherche pour le moment.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book, i) => (
            <AnimatedSection key={book.id} delay={Math.min(i * 0.04, 0.3)}>
              <BookCard book={book} related={books} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
