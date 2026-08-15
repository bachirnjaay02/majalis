import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function XamXamAdminDashboard() {
  const [books, playlists, tracks, videos, wirds] = await Promise.all([
    prisma.xamXamBook.count(),
    prisma.xamXamPlaylist.count(),
    prisma.xamXamTrack.count(),
    prisma.xamXamVideo.count(),
    prisma.xamXamWird.count(),
  ]);

  const cards = [
    { label: "Livres", value: books, href: "/xamxam/admin/books" },
    { label: "Playlists", value: playlists, href: "/xamxam/admin/playlists" },
    { label: "Pistes audio", value: tracks, href: "/xamxam/admin/playlists" },
    { label: "Vidéos", value: videos, href: "/xamxam/admin/videos" },
    { label: "Wirds", value: wirds, href: "/xamxam/admin/wirds" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
        Tableau de bord
      </h1>
      <p className="mt-1 text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
        Gérez le contenu publié sur Majalis.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 transition-colors hover:border-[#f3d27a]/30"
          >
            <p className="font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#8a6420] dark:text-[#f3d27a]">
              {c.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-[#241d14]/50 dark:text-[#f3e9d2]/50">
              {c.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5 text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60">
        <p className="font-medium text-[#241d14] dark:text-[#f3e9d2]">Ajouter du contenu</p>
        <p className="mt-1">
          Les fichiers PDF, audio et vidéo sont hébergés à l&apos;extérieur
          (Google Drive, YouTube, etc.) : renseignez simplement leur lien
          public dans chaque formulaire.
        </p>
      </div>
    </div>
  );
}
