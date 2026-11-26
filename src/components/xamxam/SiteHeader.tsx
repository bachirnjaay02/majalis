"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/xamxam/ThemeToggle";

const links = [
  { href: "/xamxam", label: "Accueil" },
  { href: "/xamxam/livres", label: "Livres" },
  { href: "/xamxam/cheikh", label: "Cheikh" },
  { href: "/xamxam/agenda", label: "Agenda" },
  { href: "/xamxam/favoris", label: "Favoris" },
  { href: "/xamxam/playlists", label: "Playlists" },
  { href: "/xamxam/videos", label: "Vidéos" },
  { href: "/xamxam/wirds", label: "Wirds" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/xamxam" ? pathname === "/xamxam" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[#8a6420]/15 bg-[#faf6ec]/90 backdrop-blur-lg dark:border-[#e8c87a]/12 dark:bg-[#1b1710]/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link href="/xamxam" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#8a6420]/25 bg-white shadow-[0_0_20px_rgba(201,151,58,0.18)] dark:border-[#e8c87a]/25 dark:bg-[#241d14] dark:shadow-[0_0_20px_rgba(232,200,122,0.18)]">
            <Image src="/xamxam-icons/logo-mark.png" alt="Majalis" width={36} height={36} className="h-full w-full object-cover" priority />
          </span>
          <span className="font-[family-name:var(--font-xamxam-display)] text-xl font-semibold tracking-wide text-[#241d14] dark:text-[#f4ecd8]">
            Majalis
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[#241d14]"
                  : "text-[#241d14]/70 hover:text-[#241d14] dark:text-[#f4ecd8]/65 dark:hover:text-[#f4ecd8]"
              }`}
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="xamxam-nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:flex" />

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#8a6420]/20 text-[#241d14] transition-colors hover:border-[#8a6420]/50 dark:border-[#e8c87a]/20 dark:text-[#f4ecd8] dark:hover:border-[#e8c87a]/50 lg:hidden"
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
            className="overflow-hidden border-t border-[#8a6420]/15 bg-[#faf6ec]/95 dark:border-[#e8c87a]/10 dark:bg-[#1b1710]/95 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1 px-5 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] text-[#241d14]"
                      : "text-[#241d14]/80 hover:text-[#241d14] dark:text-[#f4ecd8]/80 dark:hover:text-[#f4ecd8]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="col-span-2 mt-1 flex items-center justify-between rounded-lg border border-[#8a6420]/15 px-3 py-2 dark:border-[#e8c87a]/10">
                <span className="text-xs text-[#241d14]/60 dark:text-[#f4ecd8]/50">Apparence</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
