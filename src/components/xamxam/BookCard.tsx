import type { XamXamBook } from "@prisma/client";
import { languageBadgeClasses, languageLabels } from "@/lib/xamxam/labels";

export default function BookCard({ book }: { book: XamXamBook }) {
  return (
    <a
      href={book.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-[#f3d27a]/35 hover:bg-[#241d14]/[0.05] dark:hover:bg-white/[0.05] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]"
    >
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f2e6c9] to-[#e6d3a4] dark:from-[#1c1a16] dark:to-[#0c0c0a]">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="px-4 text-center font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#8a6420] dark:text-[#f3d27a]">
            {book.title}
          </span>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur ${languageBadgeClasses[book.language]}`}
        >
          {languageLabels[book.language]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-[family-name:var(--font-xamxam-display)] text-base font-semibold text-[#241d14] dark:text-[#f3e9d2]">
          {book.title}
        </h3>
        <p className="text-xs text-[#241d14]/55 dark:text-[#f3e9d2]/55">{book.author}</p>
        {book.category && (
          <span className="mt-2 w-fit rounded-full bg-[#f3d27a]/10 px-2.5 py-0.5 text-[11px] text-[#8a6420] dark:text-[#f3d27a]">
            {book.category}
          </span>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] opacity-0 transition-opacity group-hover:opacity-100">
          Lire le PDF →
        </span>
      </div>
    </a>
  );
}
