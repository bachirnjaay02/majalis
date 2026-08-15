import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateWird, deleteWird } from "../../../actions";
import { languageLabels } from "@/lib/xamxam/labels";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function EditWirdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wird = await prisma.xamXamWird.findUnique({ where: { id } });
  if (!wird) notFound();

  return (
    <div>
      <Link
        href="/xamxam/admin/wirds"
        className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]"
      >
        ← Tous les wirds
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Modifier le wird
      </h1>

      <form
        action={updateWird.bind(null, wird.id)}
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
            defaultValue={wird.title}
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
            defaultValue={wird.language}
            className={inputClass}
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="moment">
            Moment de récitation
          </label>
          <input
            id="moment"
            name="moment"
            defaultValue={wird.moment ?? ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="content">
            Texte du wird
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            required
            defaultValue={wird.content}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="audioUrl">
            Lien audio (optionnel)
          </label>
          <input
            id="audioUrl"
            name="audioUrl"
            type="url"
            defaultValue={wird.audioUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Enregistrer
          </button>
          <Link href="/xamxam/admin/wirds" className={secondaryButtonClass}>
            Annuler
          </Link>
        </div>
      </form>

      <ConfirmDeleteForm
        action={deleteWird.bind(null, wird.id)}
        confirmMessage={`Supprimer « ${wird.title} » ?`}
        className="mt-4"
      >
        <button className={dangerButtonClass}>Supprimer ce wird</button>
      </ConfirmDeleteForm>
    </div>
  );
}
