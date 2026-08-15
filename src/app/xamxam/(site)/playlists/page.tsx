import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export const metadata: Metadata = {
  title: "Majalis — Playlists",
};

export default async function PlaylistsPage() {
  const playlists = await prisma.xamXamPlaylist.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tracks: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <AnimatedSection>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
          Playlist
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          Récitations et enseignements audio
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60 md:text-base">
          Des playlists audio pour écouter les qacida et enseignements où que
          vous soyez.
        </p>
      </AnimatedSection>

      {playlists.length === 0 ? (
        <p className="mt-16 text-center text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
          Aucune playlist disponible pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist, i) => (
            <AnimatedSection key={playlist.id} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/xamxam/playlists/${playlist.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-[#f3d27a]/35"
              >
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[#f2e6c9] to-[#e6d3a4] dark:from-[#1c1a16] dark:to-[#0c0c0a]">
                  {playlist.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-4xl">♪</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f3e9d2]">
                    {playlist.title}
                  </h3>
                  {playlist.description && (
                    <p className="line-clamp-2 text-xs text-[#241d14]/55 dark:text-[#f3e9d2]/55">
                      {playlist.description}
                    </p>
                  )}
                  <span className="mt-2 text-xs text-[#8a6420] dark:text-[#f3d27a]">
                    {playlist._count.tracks} piste
                    {playlist._count.tracks > 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
