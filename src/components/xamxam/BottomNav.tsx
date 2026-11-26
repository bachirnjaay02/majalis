"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6.5h-6V21H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinejoin="round" />
    </svg>
  );
}

function CheikhIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 21c0-4 3.4-6.8 7.5-6.8s7.5 2.8 7.5 6.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tabs: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/xamxam", label: "Accueil", icon: <HomeIcon /> },
  { href: "/xamxam/livres", label: "Livres", icon: <BookIcon /> },
  { href: "/xamxam/cheikh", label: "Cheikh", icon: <CheikhIcon /> },
  { href: "/xamxam/agenda", label: "Agenda", icon: <CalendarIcon /> },
  { href: "/xamxam/favoris", label: "Favoris", icon: <HeartIcon /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/xamxam" ? pathname === "/xamxam" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-[26px] border border-[#8a6420]/20 bg-white/95 px-2 py-2 shadow-[0_18px_50px_-12px_rgba(60,45,20,0.16)] backdrop-blur-xl dark:border-[#e8c87a]/20 dark:bg-[#171208]/90 dark:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)]">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition-colors ${
                active
                  ? "bg-[#8a6420]/12 text-[#8a6420] dark:bg-[#e8c87a]/12 dark:text-[#e8c87a]"
                  : "text-[#241d14]/65 hover:text-[#241d14] dark:text-[#f4ecd8]/55 dark:hover:text-[#f4ecd8]"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
