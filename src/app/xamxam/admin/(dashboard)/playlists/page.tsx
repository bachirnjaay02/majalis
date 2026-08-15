import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPlaylist } from "../../actions";
import { inputClass, labelClass, primaryButtonClass } from "@/components/xamxam/admin/formStyles";

export default async function AdminPlaylistsPage() {
  const playlists = await prisma.xamXamPlaylist.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tracks: true } } },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Playlists
      </h1>
      <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
        Créez une playlist puis ajoutez-y des pistes audio.
      </p>

      <form
        action={createPlaylist}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass} htmlFor="title">
            Titre
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="coverUrl">
            Image de couverture (optionnel)
          </label>
          <input id="coverUrl" name="coverUrl" type="url" className={inputClass} />
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
            Créer la playlist
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {playlists.length === 0 && (
          <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">Aucune playlist pour le moment.</p>
        )}
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/xamxam/admin/playlists/${playlist.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f3d27a]/10 bg-[#241d14]/[0.02] dark:bg-white/[0.02] px-4 py-3 hover:border-[#f3d27a]/30"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#241d14] dark:text-[#f3e9d2]">
                {playlist.title}
              </p>
              <p className="text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">
                {playlist._count.tracks} piste
                {playlist._count.tracks > 1 ? "s" : ""}
              </p>
            </div>
            <span className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a]">Gérer →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
