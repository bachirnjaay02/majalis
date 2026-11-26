import type { XamXamLanguage } from "@prisma/client";

/**
 * Forme minimale d'un khassaïde utilisée par les composants publics.
 * Compatible avec le modèle Prisma `XamXamBook` et avec les favoris
 * stockés côté navigateur (localStorage).
 */
export type KhassaideBook = {
  id: string;
  title: string;
  arabicTitle: string | null;
  author: string;
  language: XamXamLanguage;
  category: string | null;
  description: string | null;
  type: string | null;
  vers: number | null;
  metre: string | null;
  annee: string | null;
  tags: string[];
  files: string[];
  coverUrl: string | null;
  pdfUrl: string;
  featured: boolean;
};

export type KhassaideFile = { label: string; url: string };

/** Les fichiers sont stockés sous la forme "Nom du fichier|https://…". */
export function bookFiles(
  book: Pick<KhassaideBook, "title" | "pdfUrl" | "files">
): KhassaideFile[] {
  const parsed = (book.files ?? [])
    .map((entry) => {
      const [label, ...rest] = entry.split("|");
      const url = rest.join("|").trim();
      if (!url) return null;
      return { label: label.trim() || "Document PDF", url };
    })
    .filter((file): file is KhassaideFile => file !== null);

  if (parsed.length > 0) return parsed;
  return [{ label: `${book.title}.pdf`, url: book.pdfUrl }];
}
