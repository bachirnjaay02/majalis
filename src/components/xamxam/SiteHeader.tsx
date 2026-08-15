"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/xamxam/ThemeToggle";

const links = [
  { href: "/xamxam", label: "Accueil" },
  { href: "/xamxam/livres", label: "Majalis" },
  { href: "/xamxam/playlists", label: "Playlist" },
  { href: "/xamxam/videos", label: "Vidéos" },
  { href: "/xamxam/wirds", label: "Wirds" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/xamxam" ? pathname === "/xamxam" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[#f3d27a]/20 bg-[#faf6ec]/85 backdrop-blur-lg dark:bg-[#0c0c0a]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/xamxam" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_20px_rgba(243,210,122,0.35)]">
            <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={36} height={36} className="h-full w-full object-cover" priority />
          </span>
          <span className="font-[family-name:var(--font-xamxam-display)] text-xl font-semibold tracking-wide text-[#241d14] dark:text-[#f3e9d2]">
            Majalis
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[#241d14] dark:text-[#f3e9d2]"
                  : "text-[#241d14]/75 hover:text-[#241d14] dark:text-[#f3e9d2]/75 dark:hover:text-[#f3e9d2]"
              }`}
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="xamxam-nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3d27a] to-[#c9973a]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:flex" />

          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3d27a]/20 text-[#241d14] dark:text-[#f3e9d2] md:hidden"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-4 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[6px] h-[1.5px] w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[12px] h-[1.5px] w-4 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#f3d27a]/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-gradient-to-r from-[#f3d27a] to-[#c9973a] text-[#241d14] dark:text-[#f3e9d2]"
                      : "text-[#241d14]/80 dark:text-[#f3e9d2]/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
