import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateBook, deleteBook } from "../../../actions";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import BookFields from "@/components/xamxam/admin/BookFields";
import {
  dangerButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.xamXamBook.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <div>
      <Link
        href="/xamxam/admin/books"
        className="text-xs font-medium text-[#8a6420] hover:text-[#8a6420] dark:text-[#f3d27a] dark:hover:text-[#f3d27a]"
      >
        ← Tous les livres
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Modifier le livre
      </h1>

      <form
        action={updateBook.bind(null, book.id)}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] p-5 dark:bg-white/[0.03] sm:grid-cols-2"
      >
        <BookFields book={book} />

        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Enregistrer
          </button>
          <Link href="/xamxam/admin/books" className={secondaryButtonClass}>
            Annuler
          </Link>
        </div>
      </form>

      <ConfirmDeleteForm
        action={deleteBook.bind(null, book.id)}
        confirmMessage={`Supprimer « ${book.title} » ?`}
        className="mt-4"
      >
        <button className={dangerButtonClass}>Supprimer ce livre</button>
      </ConfirmDeleteForm>
    </div>
  );
}
