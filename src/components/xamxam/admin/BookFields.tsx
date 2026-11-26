import type { XamXamBook } from "@prisma/client";
import { languageLabels } from "@/lib/xamxam/labels";
import { inputClass, labelClass } from "./formStyles";

/**
 * Champs du formulaire livre, partagés par la création et la modification.
 * Les métadonnées alimentent la fiche khassaïde publique (type, vers, mètre,
 * année, tags, fichiers).
 */
export default function BookFields({ book }: { book?: XamXamBook }) {
  return (
    <>
      <div>
        <label className={labelClass} htmlFor="title">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={book?.title ?? ""}
          placeholder="Jaalibatul Maraaxib"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="arabicTitle">
          Titre arabe (optionnel)
        </label>
        <input
          id="arabicTitle"
          name="arabicTitle"
          dir="rtl"
          defaultValue={book?.arabicTitle ?? ""}
          placeholder="جاذبة المراكب"
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
          defaultValue={book?.author ?? "Serigne Touba Cheikh Ahmadou Bamba"}
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
          defaultValue={book?.language ?? "ARABE"}
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
          defaultValue={book?.category ?? ""}
          placeholder="Soufisme, Poésie, Fiqh…"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="type">
          Type
        </label>
        <input
          id="type"
          name="type"
          defaultValue={book?.type ?? ""}
          placeholder="Qacida, Traité, Traduction…"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="vers">
          Nombre de vers (optionnel)
        </label>
        <input
          id="vers"
          name="vers"
          type="number"
          min={1}
          defaultValue={book?.vers ?? ""}
          placeholder="143"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="metre">
          Mètre poétique (arood)
        </label>
        <input
          id="metre"
          name="metre"
          defaultValue={book?.metre ?? ""}
          placeholder="Khafîf, Rajaz…"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="annee">
          Année de composition
        </label>
        <input
          id="annee"
          name="annee"
          defaultValue={book?.annee ?? ""}
          placeholder="1327 H ou 2020"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="pdfUrl">
          Lien PDF principal
        </label>
        <input
          id="pdfUrl"
          name="pdfUrl"
          type="url"
          required
          defaultValue={book?.pdfUrl ?? ""}
          placeholder="https://…"
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
          defaultValue={book?.coverUrl ?? ""}
          placeholder="https://…"
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
          defaultValue={book?.description ?? ""}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="tags">
          Tags (séparés par des virgules)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={book?.tags?.join(", ") ?? ""}
          placeholder="Qacida, Madiih, Prophète"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="files">
          Fichiers — un par ligne, au format « Nom|https://… »
        </label>
        <textarea
          id="files"
          name="files"
          rows={5}
          defaultValue={book?.files?.join("\n") ?? ""}
          placeholder={"Texte arabe|https://…\nTraduction wolof|https://…\nTafsir|https://…"}
          className={`${inputClass} font-mono text-xs`}
        />
        <p className="mt-1 text-[11px] text-[#241d14]/45 dark:text-[#f3e9d2]/45">
          Laissez vide pour utiliser le PDF principal comme unique fichier.
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm text-[#241d14]/70 dark:text-[#f3e9d2]/70">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={book?.featured ?? false}
          className="accent-[#f3d27a]"
        />
        Mettre en avant sur la page d&apos;accueil
      </label>
    </>
  );
}
