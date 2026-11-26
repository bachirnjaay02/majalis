"use client";

import { useState } from "react";
import { languageLabels } from "@/lib/xamxam/labels";
import type { KhassaideBook } from "@/lib/xamxam/types";
import CoverArt from "./CoverArt";
import KhassaideSheet from "./KhassaideSheet";

export default function BookCard({
  book,
  related,
}: {
  book: KhassaideBook;
  related?: KhassaideBook[];
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(book);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCurrent(book);
          setOpen(true);
        }}
        className="group flex w-full flex-col text-left"
      >
        <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl border border-[#e8c87a]/15 bg-[#241d14] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#e8c87a]/40">
          <CoverArt
            book={book}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-2 top-2 rounded-full border border-[#e8c87a]/30 bg-[#171208]/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#e8c87a] backdrop-blur">
            {languageLabels[book.language]}
          </span>
        </span>
        <span className="mt-2.5 block truncate font-[family-name:var(--font-xamxam-display)] text-sm font-semibold text-[#241d14] dark:text-[#f4ecd8]">
          {book.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-[#241d14]/60 dark:text-[#f4ecd8]/50">
          {book.type ?? book.category ?? book.author}
        </span>
      </button>

      {open && (
        <KhassaideSheet
          book={current}
          related={related}
          onClose={() => setOpen(false)}
          onSelectRelated={setCurrent}
        />
      )}
    </>
  );
}
