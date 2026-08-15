import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateBook, deleteBook } from "../../../actions";
import { languageLabels } from "@/lib/xamxam/labels";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
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
        className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]"
      >
        ← Tous les livres
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Modifier le livre
      </h1>

      <form
        action={updateBook.bind(null, book.id)}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass} htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={book.title}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="author">
            Auteur
          </label>
          <input
            id="author"
            name="author"
            defaultValue={book.author}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="language">
            Langue
          </label>
          <select
            id="language"
            name="language"
            required
            defaultValue={book.language}
            className={inputClass}
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Thématique
          </label>
          <input
            id="category"
            name="category"
            defaultValue={book.category ?? ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="pdfUrl">
            Lien PDF
          </label>
          <input
            id="pdfUrl"
            name="pdfUrl"
            type="url"
            required
            defaultValue={book.pdfUrl}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="coverUrl">
            Image de couverture (optionnel)
          </label>
          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            defaultValue={book.coverUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">
            Description (optionnel)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={book.description ?? ""}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#241d14]/70 dark:text-[#f3e9d2]/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={book.featured}
            className="accent-[#f3d27a]"
          />
          Mettre en avant sur la page d&apos;accueil
        </label>

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
