import type { KhassaideBook } from "@/lib/xamxam/types";

/**
 * Couverture d'un khassaïde : image si disponible, sinon une couverture
 * typographique avec le ruban doré de la bibliothèque.
 */
export default function CoverArt({
  book,
  className = "",
}: {
  book: KhassaideBook;
  className?: string;
}) {
  if (book.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.coverUrl}
        alt={book.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#3d3722] via-[#2b2517] to-[#17120b] px-3 text-center ${className}`}
    >
      <div className="pointer-events-none absolute inset-2.5 rounded-[10px] border border-[#e8c87a]/35" />
      <div className="pointer-events-none absolute inset-4 rounded-[7px] border border-[#e8c87a]/15" />

      <span className="kx-ribbon absolute -right-10 top-5 w-36 rotate-45 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em]">
        قصيدة
      </span>

      <p
        dir="rtl"
        className="font-[family-name:var(--font-xamxam-arabic)] text-xl leading-tight text-[#e8c87a] sm:text-2xl"
      >
        {book.arabicTitle ?? "خَصِيدَة"}
      </p>
      <span className="mt-3 h-px w-10 bg-[#e8c87a]/40" />
      <p className="mt-3 line-clamp-3 max-w-[88%] font-[family-name:var(--font-xamxam-display)] text-sm font-semibold leading-snug text-[#f4ecd8]">
        {book.title}
      </p>
      <p className="mt-1.5 text-[8px] uppercase tracking-[0.3em] text-[#f4ecd8]/45">
        Majalis
      </p>
    </div>
  );
}
