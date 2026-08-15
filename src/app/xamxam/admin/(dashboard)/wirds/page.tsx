import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createWird, deleteWird } from "../../actions";
import { languageLabels } from "@/lib/xamxam/labels";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function AdminWirdsPage() {
  const wirds = await prisma.xamXamWird.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Wirds
      </h1>
      <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
        Ajoutez les litanies et invocations transmises par Serigne Touba.
      </p>

      <form
        action={createWird}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass} htmlFor="title">
            Titre
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="language">
            Langue
          </label>
          <select id="language" name="language" required className={inputClass}>
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
            placeholder="Matin, Soir, Après chaque prière..."
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
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="audioUrl">
            Lien audio (optionnel)
          </label>
          <input id="audioUrl" name="audioUrl" type="url" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Ajouter le wird
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {wirds.length === 0 && (
          <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">Aucun wird pour le moment.</p>
        )}
        {wirds.map((wird) => (
          <div
            key={wird.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f3d27a]/10 bg-[#241d14]/[0.02] dark:bg-white/[0.02] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#241d14] dark:text-[#f3e9d2]">
                {wird.title}
              </p>
              <p className="text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">
                {languageLabels[wird.language]}
                {wird.moment ? ` · ${wird.moment}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/xamxam/admin/wirds/${wird.id}`}
                className="rounded-lg border border-[#f3d27a]/20 px-3 py-1.5 text-xs font-medium text-[#241d14] dark:text-[#f3e9d2] hover:border-[#f3d27a]/40"
              >
                Modifier
              </Link>
              <ConfirmDeleteForm
                action={deleteWird.bind(null, wird.id)}
                confirmMessage={`Supprimer « ${wird.title} » ?`}
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
