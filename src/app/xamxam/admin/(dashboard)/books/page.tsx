import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createBook, deleteBook } from "../../actions";
import { languageLabels } from "@/lib/xamxam/labels";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import BookFields from "@/components/xamxam/admin/BookFields";
import {
  dangerButtonClass,
  primaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function AdminBooksPage() {
  const books = await prisma.xamXamBook.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Livres
      </h1>
      <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
        Ajoutez et gérez les livres du Majalis. Les métadonnées saisies ici
        alimentent la fiche publique du khassaïde.
      </p>

      <form
        action={createBook}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] p-5 dark:bg-white/[0.03] sm:grid-cols-2"
      >
        <BookFields />
        <div className="sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Ajouter le livre
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {books.length === 0 && (
          <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
            Aucun livre pour le moment.
          </p>
        )}
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f3d27a]/10 bg-[#241d14]/[0.02] px-4 py-3 dark:bg-white/[0.02]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#241d14] dark:text-[#f3e9d2]">
                {book.title}
                {book.featured && (
                  <span className="ml-2 rounded-full bg-[#f3d27a]/15 px-2 py-0.5 text-[10px] text-[#8a6420] dark:text-[#f3d27a]">
                    à la une
                  </span>
                )}
              </p>
              <p className="text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">
                {languageLabels[book.language]}
                {book.type ? ` · ${book.type}` : ""}
                {book.category ? ` · ${book.category}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/xamxam/admin/books/${book.id}`}
                className="rounded-lg border border-[#f3d27a]/20 px-3 py-1.5 text-xs font-medium text-[#241d14] hover:border-[#f3d27a]/40 dark:text-[#f3e9d2]"
              >
                Modifier
              </Link>
              <ConfirmDeleteForm
                action={deleteBook.bind(null, book.id)}
                confirmMessage={`Supprimer « ${book.title} » ?`}
              >
                <button className={dangerButtonClass}>Supprimer</button>
              </ConfirmDeleteForm>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
