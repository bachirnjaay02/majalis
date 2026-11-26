"use client";

import Link from "next/link";
import {
  daysUntil,
  formatEventDate,
  hijriToday,
  nextEvent,
  upcomingEvents,
} from "@/lib/xamxam/calendar";

export default function IslamicCalendar() {
  const today = new Date();
  const ramadan = nextEvent("ramadan", today);
  const events = upcomingEvents(today).slice(0, 4);
  const days = ramadan ? daysUntil(ramadan.date, today) : null;

  return (
    <section className="kx-panel rounded-3xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
          Échéancier islamique
        </p>
        <p className="text-xs text-[#241d14]/65 dark:text-[#f4ecd8]/55" suppressHydrationWarning>
          {hijriToday(today)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-3">
          <p
            className="font-[family-name:var(--font-xamxam-display)] text-5xl font-semibold leading-none text-[#8a6420] dark:text-[#e8c87a]"
            suppressHydrationWarning
          >
            {days !== null ? `J-${days}` : "—"}
          </p>
          <div className="pb-0.5">
            <p className="text-sm font-medium text-[#241d14] dark:text-[#f4ecd8]">avant le Ramadan</p>
            {ramadan && (
              <p className="mt-0.5 text-xs text-[#241d14]/60 dark:text-[#f4ecd8]/50" suppressHydrationWarning>
                {formatEventDate(ramadan.date)} · {ramadan.hijri}
              </p>
            )}
          </div>
        </div>
        <Link
          href="/xamxam/agenda"
          className="rounded-full border border-[#8a6420]/30 px-4 py-2 text-xs font-medium text-[#8a6420] transition-colors hover:border-[#8a6420]/60 dark:border-[#e8c87a]/25 dark:text-[#e8c87a] dark:hover:border-[#e8c87a]/60"
        >
          Voir l&apos;agenda →
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href="/xamxam/agenda"
            className="rounded-xl border border-[#8a6420]/15 bg-black/[0.02] px-3 py-2 transition-colors hover:border-[#8a6420]/40 dark:border-[#e8c87a]/10 dark:bg-white/[0.03] dark:hover:border-[#e8c87a]/35"
          >
            <p className="text-[10px] uppercase tracking-wide text-[#8a6420] dark:text-[#e8c87a]/80">
              {event.hijri}
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-[#241d14] dark:text-[#f4ecd8]">
              {event.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
