"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { languageLabels } from "@/lib/xamxam/labels";
import { bookFiles, type KhassaideBook } from "@/lib/xamxam/types";
import {
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
} from "@/lib/xamxam/favorites";
import CoverArt from "./CoverArt";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KhassaideSheet({
  book,
  related = [],
  onClose,
  onSelectRelated,
}: {
  book: KhassaideBook;
  related?: KhassaideBook[];
  onClose: () => void;
  onSelectRelated?: (book: KhassaideBook) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const favorite = useSyncExternalStore(
    subscribeFavorites,
    () => isFavorite(book.id),
    () => false
  );

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [book.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const files = bookFiles(book);
  const metadata: { label: string; value: string | null }[] = [
    { label: "Langue", value: languageLabels[book.language] },
    { label: "Auteur", value: book.author },
    { label: "Type", value: book.type },
    { label: "Thème", value: book.category },
    { label: "Vers", value: book.vers ? String(book.vers) : null },
    { label: "Mètre", value: book.metre },
    { label: "Année", value: book.annee },
  ];
  const others = related.filter((item) => item.id !== book.id).slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Fiche de ${book.title}`}
    >
      <button
        type="button"
        aria-label="Fermer la fiche"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="kx-panel relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[30px] bg-[#faf6ec]/95 p-5 pb-8 dark:bg-[#1b1710]/95 sm:rounded-[30px] sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6420]/25 bg-white/80 text-[#241d14]/70 transition-colors hover:border-[#8a6420]/50 hover:text-[#241d14] dark:border-[#e8c87a]/20 dark:bg-[#171208]/80 dark:text-[#f4ecd8]/70 dark:hover:border-[#e8c87a]/50 dark:hover:text-[#f4ecd8]"
        >
          <CloseIcon />
        </button>

        <div className="flex gap-4 pr-10">
          <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-[#8a6420]/25 shadow-[0_16px_30px_-16px_rgba(60,45,20,0.2)] dark:border-[#e8c87a]/20 dark:shadow-[0_16px_30px_-16px_rgba(0,0,0,0.9)]">
            <CoverArt book={book} />
          </div>
          <div className="min-w-0 pt-1">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]/80">
              {book.type ?? "Khassaïde"}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-xamxam-display)] text-xl font-semibold leading-tight text-[#241d14] dark:text-[#f4ecd8] sm:text-2xl">
              {book.title}
            </h2>
            {book.arabicTitle && (
              <p
                dir="rtl"
                className="mt-1 font-[family-name:var(--font-xamxam-arabic)] text-lg text-[#8a6420] dark:text-[#e8c87a]/90"
              >
                {book.arabicTitle}
              </p>
            )}
            <p className="mt-1 line-clamp-2 text-xs text-[#241d14]/65 dark:text-[#f4ecd8]/55">{book.author}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-4 py-2.5 text-center text-sm font-semibold text-[#241d14] transition-transform hover:scale-[1.02]"
          >
            Lire
          </a>
          <button
            type="button"
            onClick={() => toggleFavorite(book)}
            aria-pressed={favorite}
            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
              favorite
                ? "border-[#8a6420]/60 bg-[#8a6420]/15 text-[#8a6420] dark:border-[#e8c87a]/60 dark:bg-[#e8c87a]/15 dark:text-[#e8c87a]"
                : "border-[#8a6420]/25 text-[#241d14]/80 hover:border-[#8a6420]/50 dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/80 dark:hover:border-[#e8c87a]/50"
            }`}
          >
            {favorite ? "Favori ✓" : "Favori"}
          </button>
          <a
            href={book.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#8a6420]/25 px-4 py-2.5 text-sm font-medium text-[#241d14]/80 transition-colors hover:border-[#8a6420]/50 hover:text-[#241d14] dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/80 dark:hover:border-[#e8c87a]/50 dark:hover:text-[#f4ecd8]"
          >
            <DownloadIcon />
            Download
          </a>
          <Link
            href="/xamxam/wirds"
            className="rounded-full border border-[#8a6420]/25 px-4 py-2.5 text-center text-sm font-medium text-[#241d14]/80 transition-colors hover:border-[#8a6420]/50 hover:text-[#241d14] dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/80 dark:hover:border-[#e8c87a]/50 dark:hover:text-[#f4ecd8]"
          >
            Programme quotidien
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]/80">
            Fiche du khassaïde
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            {metadata.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#8a6420]/15 bg-black/[0.02] px-3 py-2 dark:border-[#e8c87a]/10 dark:bg-white/[0.03]"
              >
                <dt className="text-[10px] uppercase tracking-wider text-[#241d14]/50 dark:text-[#f4ecd8]/40">
                  {item.label}
                </dt>
                <dd className="mt-0.5 truncate text-xs font-medium text-[#241d14] dark:text-[#f4ecd8]" title={item.value ?? undefined}>
                  {item.value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {(book.tags ?? []).length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]/80">
              Rechercher par tag
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(book.tags ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={`/xamxam/livres?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[#8a6420]/20 bg-[#8a6420]/5 px-3 py-1 text-[11px] text-[#241d14]/75 transition-colors hover:border-[#8a6420]/50 hover:text-[#8a6420] dark:border-[#e8c87a]/15 dark:bg-[#e8c87a]/5 dark:text-[#f4ecd8]/75 dark:hover:border-[#e8c87a]/45 dark:hover:text-[#e8c87a]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]/80">
              Fichiers
            </p>
            <span className="rounded-full bg-[#8a6420]/10 px-2 py-0.5 text-[10px] text-[#8a6420] dark:bg-[#e8c87a]/10 dark:text-[#e8c87a]">
              {files.length} fichier{files.length > 1 ? "s" : ""}
            </span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {files.map((file) => (
              <li key={`${file.label}-${file.url}`}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-[#8a6420]/15 bg-black/[0.02] px-3 py-2 text-xs text-[#241d14]/80 transition-colors hover:border-[#8a6420]/40 hover:text-[#241d14] dark:border-[#e8c87a]/8 dark:bg-white/[0.02] dark:text-[#f4ecd8]/75 dark:hover:border-[#e8c87a]/30 dark:hover:text-[#f4ecd8]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8a6420]/10 text-[9px] font-bold text-[#8a6420] dark:bg-[#e8c87a]/10 dark:text-[#e8c87a]">
                    PDF
                  </span>
                  <span className="min-w-0 flex-1 truncate">{file.label}</span>
                  <DownloadIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {others.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]/80">
              À lire aussi
            </p>
            <div className="kx-scrollbar-none -mx-1 mt-2 flex gap-3 overflow-x-auto px-1 pb-1">
              {others.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectRelated?.(item)}
                  className="w-24 shrink-0 text-left"
                >
                  <span className="block h-32 w-24 overflow-hidden rounded-lg border border-[#8a6420]/20 dark:border-[#e8c87a]/15">
                    <CoverArt book={item} />
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[11px] font-medium leading-snug text-[#241d14]/85 dark:text-[#f4ecd8]/80">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
