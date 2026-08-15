import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#f3d27a]/10 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(36,29,20,0.12)]">
          <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={36} height={36} className="h-full w-full object-cover" />
        </span>
        <p className="max-w-md text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60">
          Majalis réunit les livres, playlists, vidéos et wirds de Serigne
          Touba Cheikh Ahmadou Bamba, pour transmettre son savoir en wolof,
          en français et en arabe.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#241d14]/50 dark:text-[#f3e9d2]/50">
          <Link href="/xamxam/livres" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            Livres
          </Link>
          <Link href="/xamxam/playlists" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            Playlists
          </Link>
          <Link href="/xamxam/videos" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            Vidéos
          </Link>
          <Link href="/xamxam/wirds" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            Wirds
          </Link>
          <Link href="/xamxam/admin/login" className="hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
            Espace administrateur
          </Link>
        </div>
        <p className="text-[11px] text-[#241d14]/35 dark:text-[#f3e9d2]/35">
          © {new Date().getFullYear()} Majalis — Bibliothèque numérique.
        </p>
        <p className="text-[11px] text-[#241d14]/35 dark:text-[#f3e9d2]/35">
          © {new Date().getFullYear()} seexbasscode — Développé par seexbasscode.
        </p>
      </div>
    </footer>
  );
}
