"use client";

import { useEffect, useState } from "react";
import {
  eventTypeLabels,
  formatEventDate,
  formatEventDateShort,
  upcomingEvents,
  type IslamicEvent,
  type IslamicEventType,
} from "@/lib/xamxam/calendar";

type Filter = "tous" | IslamicEventType;

const filters: { value: Filter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "magal", label: "Magal" },
  { value: "ramadan", label: "Ramadan" },
  { value: "evenement", label: "Événement" },
];

const badgeClasses: Record<IslamicEventType, string> = {
  magal: "bg-[#8a6420]/15 text-[#8a6420] dark:bg-[#e8c87a]/15 dark:text-[#e8c87a]",
  ramadan: "bg-[#2d5a27]/15 text-[#2d5a27] dark:bg-[#9db98a]/15 dark:text-[#c3d8b2]",
  evenement: "bg-black/[0.06] text-[#241d14]/70 dark:bg-white/10 dark:text-[#f4ecd8]/75",
};

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function icsDate(iso: string) {
  return iso.replaceAll("-", "");
}

function nextDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

function buildIcs(event: IslamicEvent) {
  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Majalis//Agenda//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@majalis`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(event.date)}`,
    `DTEND;VALUE=DATE:${icsDate(nextDay(event.date))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(event: IslamicEvent) {
  const blob = new Blob([buildIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AgendaView() {
  const [filter, setFilter] = useState<Filter>("tous");
  const [selected, setSelected] = useState<IslamicEvent | null>(null);
  const [feedback, setFeedback] = useState("");

  const events = upcomingEvents(new Date());
  const visible =
    filter === "tous" ? events : events.filter((event) => event.type === filter);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  async function shareEvent(event: IslamicEvent) {
    const text = `${event.title} — ${formatEventDate(event.date)} (${event.hijri})`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: event.title, text });
        return;
      } catch {
        // Partage annulé : on retombe sur la copie.
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Événement copié dans le presse-papiers");
    } catch {
      setFeedback("Partage indisponible sur cet appareil");
    }
    window.setTimeout(() => setFeedback(""), 2500);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] text-[#241d14]"
                  : "border border-[#8a6420]/20 text-[#241d14]/70 hover:border-[#8a6420]/50 hover:text-[#241d14] dark:border-[#e8c87a]/15 dark:text-[#f4ecd8]/65 dark:hover:border-[#e8c87a]/40 dark:hover:text-[#f4ecd8]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {visible.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setSelected(event)}
            className="kx-panel flex gap-4 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#8a6420]/40 dark:hover:border-[#e8c87a]/35"
          >
            <span className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#8a6420]/20 bg-[#8a6420]/5 py-2 dark:border-[#e8c87a]/15 dark:bg-[#e8c87a]/5">
              <span className="font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold leading-none text-[#8a6420] dark:text-[#e8c87a]">
                {Number(event.date.slice(8, 10))}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-wider text-[#241d14]/60 dark:text-[#f4ecd8]/50">
                {formatEventDateShort(event.date).split(" ")[1]}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badgeClasses[event.type]}`}
                >
                  {eventTypeLabels[event.type]}
                </span>
                <span className="text-[10px] text-[#241d14]/50 dark:text-[#f4ecd8]/40">{event.hijri}</span>
              </span>
              <span className="mt-1 block font-[family-name:var(--font-xamxam-display)] text-base font-semibold text-[#241d14] dark:text-[#f4ecd8]">
                {event.title}
              </span>
              <span className="mt-0.5 block text-xs text-[#241d14]/60 dark:text-[#f4ecd8]/50">
                {event.location} · {formatEventDate(event.date)}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs text-[#241d14]/75 dark:text-[#f4ecd8]/65">
                {event.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-8 text-sm text-[#241d14]/50 dark:text-[#f4ecd8]/50">
          Aucun événement à venir pour ce filtre.
        </p>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="kx-panel relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[30px] bg-[#faf6ec]/95 p-6 dark:bg-[#1b1710]/95 sm:rounded-[30px]">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${badgeClasses[selected.type]}`}
              >
                {eventTypeLabels[selected.type]}
              </span>
              <span className="text-xs text-[#241d14]/55 dark:text-[#f4ecd8]/45">{selected.hijri}</span>
            </div>

            <h2 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f4ecd8]">
              {selected.title}
            </h2>
            <p
              dir="rtl"
              className="font-[family-name:var(--font-xamxam-arabic)] text-lg text-[#8a6420] dark:text-[#e8c87a]/90"
            >
              {selected.arabicTitle}
            </p>
            <p className="mt-2 text-sm text-[#8a6420] dark:text-[#e8c87a]/90">
              {formatEventDate(selected.date)}
            </p>
            <p className="text-xs text-[#241d14]/60 dark:text-[#f4ecd8]/50">{selected.location}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#241d14]/80 dark:text-[#f4ecd8]/75">
              {selected.description}
            </p>
            {selected.provisional && (
              <p className="mt-3 rounded-xl border border-[#8a6420]/20 bg-[#8a6420]/5 px-3 py-2 text-[11px] text-[#241d14]/70 dark:border-[#e8c87a]/15 dark:bg-[#e8c87a]/5 dark:text-[#f4ecd8]/50">
                Date prévisionnelle, sous réserve de l&apos;observation lunaire
                (CONACOC).
              </p>
            )}

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => downloadIcs(selected)}
                className="w-full rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-4 py-3 text-sm font-semibold text-[#241d14] transition-transform hover:scale-[1.01]"
              >
                Ajouter au calendrier
              </button>
              <button
                type="button"
                onClick={() => shareEvent(selected)}
                className="w-full rounded-full border border-[#8a6420]/30 px-4 py-3 text-sm font-medium text-[#241d14] transition-colors hover:border-[#8a6420]/60 dark:border-[#e8c87a]/25 dark:text-[#f4ecd8]/85 dark:hover:border-[#e8c87a]/60"
              >
                Partager
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-full px-4 py-2.5 text-sm text-[#241d14]/60 transition-colors hover:text-[#241d14] dark:text-[#f4ecd8]/50 dark:hover:text-[#f4ecd8]"
              >
                Fermer
              </button>
            </div>

            {feedback && (
              <p className="mt-2 text-center text-xs text-[#8a6420] dark:text-[#e8c87a]">{feedback}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
