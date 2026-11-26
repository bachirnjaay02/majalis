"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { languageLabels } from "@/lib/xamxam/labels";
import type { KhassaideBook } from "@/lib/xamxam/types";
import {
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
} from "@/lib/xamxam/favorites";
import CoverArt from "./CoverArt";
import KhassaideSheet from "./KhassaideSheet";

function circularOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function CoverCarousel({ books }: { books: KhassaideBook[] }) {
  const [active, setActive] = useState(0);
  const [sheetBook, setSheetBook] = useState<KhassaideBook | null>(null);

  const activeBook = books[active];
  const favorite = useSyncExternalStore(
    subscribeFavorites,
    () => (activeBook ? isFavorite(activeBook.id) : false),
    () => false
  );

  if (!activeBook) return null;

  const go = (direction: number) =>
    setActive((current) => (current + direction + books.length) % books.length);

  return (
    <div>
      <div className="relative mx-auto flex h-[330px] w-full max-w-2xl items-center justify-center overflow-hidden [perspective:1400px] sm:h-[400px]">
        {books.map((book, index) => {
          const offset = circularOffset(index, active, books.length);
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          return (
            <motion.button
              key={book.id}
              type="button"
              aria-label={
                offset === 0
                  ? `Ouvrir la fiche de ${book.title}`
                  : `Afficher ${book.title}`
              }
              onClick={() => (offset === 0 ? setSheetBook(book) : setActive(index))}
              initial={false}
              animate={{
                x: `${offset * 58}%`,
                z: -abs * 130,
                rotateY: offset === 0 ? 0 : offset > 0 ? -34 : 34,
                scale: offset === 0 ? 1 : 0.84,
                opacity: offset === 0 ? 1 : 0.55,
              }}
              transition={{ type: "spring", stiffness: 130, damping: 22 }}
              style={{ zIndex: 20 - abs, transformStyle: "preserve-3d" }}
              className="absolute h-[250px] w-[172px] overflow-hidden rounded-2xl border border-[#e8c87a]/25 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)] sm:h-[320px] sm:w-[220px]"
            >
              <CoverArt book={book} />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Khassaïde précédent"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a6420]/25 text-lg text-[#241d14]/75 transition-colors hover:border-[#8a6420]/60 hover:text-[#8a6420] dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/70 dark:hover:border-[#e8c87a]/50 dark:hover:text-[#e8c87a]"
        >
          ‹
        </button>
        <div className="flex items-center gap-1.5">
          {books.map((book, index) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={book.title}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all ${
                index === active
                  ? "w-5 bg-[#8a6420] dark:bg-[#e8c87a]"
                  : "w-1.5 bg-[#241d14]/25 dark:bg-[#f4ecd8]/25"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Khassaïde suivant"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a6420]/25 text-lg text-[#241d14]/75 transition-colors hover:border-[#8a6420]/60 hover:text-[#8a6420] dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/70 dark:hover:border-[#e8c87a]/50 dark:hover:text-[#e8c87a]"
        >
          ›
        </button>
      </div>

      <div className="kx-panel mx-auto mt-6 max-w-md rounded-3xl p-4">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a6420] dark:text-[#e8c87a]/80">
            {activeBook.type ?? "Khassaïde"} · {languageLabels[activeBook.language]}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-xamxam-display)] text-xl font-semibold text-[#241d14] dark:text-[#f4ecd8]">
            {activeBook.title}
          </h2>
          <p className="mt-0.5 text-xs text-[#241d14]/60 dark:text-[#f4ecd8]/50">{activeBook.author}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={activeBook.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-3 py-2.5 text-center text-sm font-semibold text-[#241d14] transition-transform hover:scale-[1.02]"
          >
            Lire
          </a>
          <button
            type="button"
            onClick={() => setSheetBook(activeBook)}
            className="rounded-full border border-[#8a6420]/30 px-3 py-2.5 text-sm font-medium text-[#241d14] transition-colors hover:border-[#8a6420]/60 hover:text-[#8a6420] dark:border-[#e8c87a]/25 dark:text-[#f4ecd8]/85 dark:hover:border-[#e8c87a]/60 dark:hover:text-[#e8c87a]"
          >
            Xam Xassida
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(activeBook)}
            aria-pressed={favorite}
            className={`rounded-full border px-3 py-2.5 text-sm font-medium transition-colors ${
              favorite
                ? "border-[#8a6420]/60 bg-[#8a6420]/15 text-[#8a6420] dark:border-[#e8c87a]/60 dark:bg-[#e8c87a]/15 dark:text-[#e8c87a]"
                : "border-[#8a6420]/25 text-[#241d14]/80 hover:border-[#8a6420]/50 dark:border-[#e8c87a]/20 dark:text-[#f4ecd8]/80 dark:hover:border-[#e8c87a]/50"
            }`}
          >
            {favorite ? "Favori ✓" : "Favori"}
          </button>
        </div>
      </div>

      {sheetBook && (
        <KhassaideSheet
          book={sheetBook}
          related={books}
          onClose={() => setSheetBook(null)}
          onSelectRelated={setSheetBook}
        />
      )}
    </div>
  );
}
