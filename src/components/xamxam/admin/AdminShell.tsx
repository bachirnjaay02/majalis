import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { logoutXamXamAdmin } from "@/app/xamxam/admin/actions";

const links = [
  { href: "/xamxam/admin", label: "Tableau de bord" },
  { href: "/xamxam/admin/books", label: "Livres" },
  { href: "/xamxam/admin/playlists", label: "Playlists" },
  { href: "/xamxam/admin/videos", label: "Vidéos" },
  { href: "/xamxam/admin/wirds", label: "Wirds" },
];

export default function AdminShell({
  children,
  adminName,
}: {
  children: ReactNode;
  adminName: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
      <aside className="shrink-0 border-b border-[#f3d27a]/10 px-5 py-6 md:w-56 md:border-b-0 md:border-r md:px-4">
        <Link href="/xamxam/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(36,29,20,0.12)]">
            <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={32} height={32} className="h-full w-full object-cover" />
          </span>
          <span className="font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f3e9d2]">
            Majalis
          </span>
        </Link>
        <p className="mt-1 text-[11px] text-[#241d14]/40 dark:text-[#f3e9d2]/40">Espace administrateur</p>

        <nav className="mt-6 flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#241d14]/70 dark:text-[#f3e9d2]/70 hover:bg-[#241d14]/[0.05] dark:hover:bg-white/[0.05] hover:text-[#241d14] dark:hover:text-[#f3e9d2]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 hidden md:block">
          <p className="truncate text-xs text-[#241d14]/45 dark:text-[#f3e9d2]/45">{adminName}</p>
          <form action={logoutXamXamAdmin} className="mt-2">
            <button className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a]">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 px-5 py-8 md:px-8">{children}</div>
    </div>
  );
}
