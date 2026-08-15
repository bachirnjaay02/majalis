import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createVideo, deleteVideo } from "../../actions";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function AdminVideosPage() {
  const videos = await prisma.xamXamVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Vidéos
      </h1>
      <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
        Ajoutez des liens YouTube ou vidéo directe.
      </p>

      <form
        action={createVideo}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass} htmlFor="title">
            Titre
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Catégorie
          </label>
          <input
            id="category"
            name="category"
            placeholder="Conférence, Documentaire..."
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="videoUrl">
            Lien vidéo (YouTube ou fichier direct)
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            required
            placeholder="https://youtube.com/watch?v=..."
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="thumbnailUrl">
            Miniature personnalisée (optionnel)
          </label>
          <input
            id="thumbnailUrl"
            name="thumbnailUrl"
            type="url"
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
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Ajouter la vidéo
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {videos.length === 0 && (
          <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">Aucune vidéo pour le moment.</p>
        )}
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f3d27a]/10 bg-[#241d14]/[0.02] dark:bg-white/[0.02] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#241d14] dark:text-[#f3e9d2]">
                {video.title}
              </p>
              {video.category && (
                <p className="text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">{video.category}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/xamxam/admin/videos/${video.id}`}
                className="rounded-lg border border-[#f3d27a]/20 px-3 py-1.5 text-xs font-medium text-[#241d14] dark:text-[#f3e9d2] hover:border-[#f3d27a]/40"
              >
                Modifier
              </Link>
              <ConfirmDeleteForm
                action={deleteVideo.bind(null, video.id)}
                confirmMessage={`Supprimer « ${video.title} » ?`}
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
