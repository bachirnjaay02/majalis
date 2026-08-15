import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PlaylistPlayer from "@/components/xamxam/PlaylistPlayer";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const playlist = await prisma.xamXamPlaylist.findUnique({ where: { id } });
  return { title: playlist ? `Majalis — ${playlist.title}` : "Majalis — Playlist" };
}

export default async function PlaylistDetailPage({
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
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Link
        href="/xamxam/playlists"
        className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]"
      >
        ← Toutes les playlists
      </Link>

      <AnimatedSection className="mt-4">
        <h1 className="font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          {playlist.title}
        </h1>
        {playlist.description && (
          <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60">
            {playlist.description}
          </p>
        )}
      </AnimatedSection>

      <AnimatedSection className="mt-8" delay={0.1}>
        {playlist.tracks.length === 0 ? (
          <p className="text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
            Aucune piste n&apos;a encore été ajoutée à cette playlist.
          </p>
        ) : (
          <PlaylistPlayer tracks={playlist.tracks} />
        )}
      </AnimatedSection>
    </div>
  );
}
