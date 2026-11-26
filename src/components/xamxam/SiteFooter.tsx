import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/xamxam/livres", label: "Livres" },
  { href: "/xamxam/cheikh", label: "Le Cheikh" },
  { href: "/xamxam/agenda", label: "Agenda" },
  { href: "/xamxam/favoris", label: "Favoris" },
  { href: "/xamxam/playlists", label: "Playlists" },
  { href: "/xamxam/videos", label: "Vidéos" },
  { href: "/xamxam/wirds", label: "Wirds" },
  { href: "/xamxam/admin/login", label: "Espace administrateur" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#8a6420]/15 px-5 pb-28 pt-10 md:pb-10 dark:border-[#e8c87a]/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#8a6420]/25 bg-white shadow-[0_0_20px_rgba(201,151,58,0.16)] dark:border-[#e8c87a]/20 dark:bg-[#241d14] dark:shadow-[0_0_20px_rgba(232,200,122,0.16)]">
          <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={36} height={36} className="h-full w-full object-cover" />
        </span>
        <p className="max-w-md text-sm text-[#241d14]/70 dark:text-[#f4ecd8]/55">
          Majalis réunit les livres, playlists, vidéos et wirds de Serigne
          Touba Cheikh Ahmadou Bamba, pour transmettre son savoir en wolof,
          en français et en arabe.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#241d14]/65 dark:text-[#f4ecd8]/45">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#8a6420] dark:hover:text-[#e8c87a]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-[#241d14]/45 dark:text-[#f4ecd8]/30">
          © {new Date().getFullYear()} Majalis — Bibliothèque numérique.
        </p>
        <p className="text-[11px] text-[#241d14]/45 dark:text-[#f4ecd8]/30">
          © {new Date().getFullYear()} seexbasscode — Développé par seexbasscode.
        </p>
      </div>
    </footer>
  );
}
