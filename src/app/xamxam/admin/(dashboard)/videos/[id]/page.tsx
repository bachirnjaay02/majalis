import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateVideo, deleteVideo } from "../../../actions";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.xamXamVideo.findUnique({ where: { id } });
  if (!video) notFound();

  return (
    <div>
      <Link
        href="/xamxam/admin/videos"
        className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]"
      >
        ← Toutes les vidéos
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Modifier la vidéo
      </h1>

      <form
        action={updateVideo.bind(null, video.id)}
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
            defaultValue={video.title}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Catégorie
          </label>
          <input
            id="category"
            name="category"
            defaultValue={video.category ?? ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="videoUrl">
            Lien vidéo
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            required
            defaultValue={video.videoUrl}
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
            defaultValue={video.thumbnailUrl ?? ""}
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
            defaultValue={video.description ?? ""}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className={primaryButtonClass}>
            Enregistrer
          </button>
          <Link href="/xamxam/admin/videos" className={secondaryButtonClass}>
            Annuler
          </Link>
        </div>
      </form>

      <ConfirmDeleteForm
        action={deleteVideo.bind(null, video.id)}
        confirmMessage={`Supprimer « ${video.title} » ?`}
        className="mt-4"
      >
        <button className={dangerButtonClass}>Supprimer cette vidéo</button>
      </ConfirmDeleteForm>
    </div>
  );
}
