import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  addTrack,
  deletePlaylist,
  deleteTrack,
  updatePlaylist,
} from "../../../actions";
import ConfirmDeleteForm from "@/components/xamxam/admin/ConfirmDeleteForm";
import {
  dangerButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/xamxam/admin/formStyles";

export default async function AdminPlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playlist = await prisma.xamXamPlaylist.findUnique({
    where: { id },
    include: { tracks: { orderBy: { order: "asc" } } },
  });
  if (!playlist) notFound();

  return (
    <div>
      <Link
        href="/xamxam/admin/playlists"
        className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]"
      >
        ← Toutes les playlists
      </Link>

      <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        {playlist.title}
      </h1>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-[#241d14]/80 dark:text-[#f3e9d2]/80">
          Informations de la playlist
        </h2>
        <form
          action={updatePlaylist.bind(null, playlist.id)}
          className="mt-3 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
        >
          <div>
            <label className={labelClass} htmlFor="title">
              Titre
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={playlist.title}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="coverUrl">
              Image de couverture (optionnel)
            </label>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              defaultValue={playlist.coverUrl ?? ""}
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
              rows={2}
              defaultValue={playlist.description ?? ""}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryButtonClass}>
              Enregistrer
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-[#241d14]/80 dark:text-[#f3e9d2]/80">
          Ajouter une piste
        </h2>
        <form
          action={addTrack.bind(null, playlist.id)}
          className="mt-3 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
        >
          <div>
            <label className={labelClass} htmlFor="title">
              Titre de la piste
            </label>
            <input id="title" name="title" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="reciter">
              Récitant (optionnel)
            </label>
            <input id="reciter" name="reciter" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="audioUrl">
              Lien audio
            </label>
            <input
              id="audioUrl"
              name="audioUrl"
              type="url"
              required
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="duration">
              Durée affichée (optionnel)
            </label>
            <input
              id="duration"
              name="duration"
              placeholder="4:32"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="order">
              Ordre
            </label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={playlist.tracks.length}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryButtonClass}>
              Ajouter la piste
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-[#241d14]/80 dark:text-[#f3e9d2]/80">
          Pistes ({playlist.tracks.length})
        </h2>
        <div className="mt-3 space-y-2">
          {playlist.tracks.length === 0 && (
            <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">Aucune piste pour le moment.</p>
          )}
          {playlist.tracks.map((track) => (
            <div
              key={track.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f3d27a]/10 bg-[#241d14]/[0.02] dark:bg-white/[0.02] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#241d14] dark:text-[#f3e9d2]">
                  {track.order}. {track.title}
                </p>
                <p className="text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">
                  {track.reciter ?? "—"}
                  {track.duration ? ` · ${track.duration}` : ""}
                </p>
              </div>
              <ConfirmDeleteForm
                action={deleteTrack.bind(null, playlist.id, track.id)}
                confirmMessage={`Supprimer la piste « ${track.title} » ?`}
              >
                <button className={dangerButtonClass}>Supprimer</button>
              </ConfirmDeleteForm>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDeleteForm
        action={deletePlaylist.bind(null, playlist.id)}
        confirmMessage={`Supprimer toute la playlist « ${playlist.title} » ?`}
        className="mt-8"
      >
        <button className={dangerButtonClass}>Supprimer cette playlist</button>
      </ConfirmDeleteForm>
    </div>
  );
}
