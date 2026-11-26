import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import BookCard from "@/components/xamxam/BookCard";
import CoverCarousel from "@/components/xamxam/CoverCarousel";
import IslamicCalendar from "@/components/xamxam/IslamicCalendar";
import { demoBooks } from "@/lib/xamxam/demo-data";
import { withFallback } from "@/lib/xamxam/safe-query";
import type { KhassaideBook } from "@/lib/xamxam/types";

export const metadata: Metadata = {
  title: "Majalis — Bibliothèque de Serigne Touba",
};

const features = [
  {
    href: "/xamxam/livres",
    title: "Khassaïdes",
    subtitle: "Livres",
    description:
      "Les écrits de Serigne Touba filtrables en wolof, français et arabe, lisibles en PDF.",
    glyph: "ﷺ",
  },
  {
    href: "/xamxam/playlists",
    title: "Playlist",
    subtitle: "Audio",
    description:
      "Des playlists de qacida et enseignements à écouter en continu, où que vous soyez.",
    glyph: "♪",
  },
  {
    href: "/xamxam/videos",
    title: "Vidéos",
    subtitle: "Conférences",
    description:
      "Conférences et enseignements filmés sur la vie et l'œuvre de Cheikh Ahmadou Bamba.",
    glyph: "▶",
  },
  {
    href: "/xamxam/wirds",
    title: "Wirds",
    subtitle: "Litanies",
    description:
      "Les invocations transmises par Serigne Touba, classées par langue et par moment.",
    glyph: "✦",
  },
];

const searchTags = [
  "Jaalibatul Maraaxib",
  "Matlabul Fawzeyni",
  "Wolof",
  "Ramadan",
  "Soufisme",
  "Touba",
];

export default async function XamXamHome() {
  const [books, bookCount, playlistCount, videoCount, wirdCount] =
    await Promise.all([
      withFallback<KhassaideBook[]>(
        () =>
          prisma.xamXamBook.findMany({
            orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
            take: 6,
          }),
        demoBooks
      ),
      withFallback(() => prisma.xamXamBook.count(), demoBooks.length),
      withFallback(() => prisma.xamXamPlaylist.count(), 0),
      withFallback(() => prisma.xamXamVideo.count(), 0),
      withFallback(() => prisma.xamXamWird.count(), 0),
    ]);

  const carouselBooks = books.length > 0 ? books : demoBooks;
  const featuredBooks = carouselBooks.slice(0, 4);

  const stats = [
    { label: "Khassaïdes", value: bookCount },
    { label: "Playlists", value: playlistCount },
    { label: "Vidéos", value: videoCount },
    { label: "Wirds", value: wirdCount },
  ];

  return (
    <div className="pb-8">
      <section className="relative mx-auto max-w-6xl px-5 pb-6 pt-10 text-center md:pt-14">
        <p
          dir="rtl"
          lang="ar"
          className="font-[family-name:var(--font-xamxam-arabic)] text-2xl text-[#8a6420] dark:text-[#e8c87a] md:text-3xl"
        >
          مجالس
        </p>

        <AnimatedSection>
          <h1 className="mx-auto mt-3 max-w-3xl font-[family-name:var(--font-xamxam-display)] text-4xl font-semibold leading-tight text-[#241d14] dark:text-[#f4ecd8] md:text-6xl">
            La bibliothèque des khassaïdes
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#241d14]/65 dark:text-[#f4ecd8]/60 md:text-base">
            Les écrits de Cheikh Ahmadou Bamba — à lire, à écouter et à
            transmettre. Livres, récitations, vidéos et wirds, réunis en un
            seul lieu.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <form
            action="/xamxam/livres"
            method="get"
            className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full border border-[#8a6420]/25 bg-white/80 p-1.5 pl-5 backdrop-blur dark:border-[#e8c87a]/20 dark:bg-white/[0.04]"
          >
            <input
              type="search"
              name="q"
              placeholder="Rechercher un khassaïde, un thème…"
              aria-label="Rechercher un khassaïde"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#241d14] outline-none placeholder:text-[#241d14]/40 dark:text-[#f4ecd8] dark:placeholder:text-[#f4ecd8]/35"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-4 py-2 text-sm font-semibold text-[#241d14] transition-transform hover:scale-[1.02]"
            >
              Rechercher
            </button>
          </form>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {searchTags.map((tag) => (
              <Link
                key={tag}
                href={`/xamxam/livres?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[#8a6420]/20 px-3 py-1 text-[11px] text-[#241d14]/65 transition-colors hover:border-[#8a6420]/50 hover:text-[#8a6420] dark:border-[#e8c87a]/10 dark:text-[#f4ecd8]/50 dark:hover:border-[#e8c87a]/40 dark:hover:text-[#e8c87a]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <CoverCarousel books={carouselBooks} />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <IslamicCalendar />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <AnimatedSection>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
            Explorer
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f4ecd8] md:text-3xl">
            Quatre portes d&apos;entrée
          </h2>
        </AnimatedSection>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.href} delay={index * 0.06}>
              <Link
                href={feature.href}
                className="kx-panel group flex h-full flex-col rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-[#8a6420]/40 dark:hover:border-[#e8c87a]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8a6420]/25 bg-[#8a6420]/10 text-lg text-[#8a6420] dark:border-[#e8c87a]/20 dark:bg-[#e8c87a]/10 dark:text-[#e8c87a]">
                  {feature.glyph}
                </span>
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#e8c87a]/80">
                  {feature.subtitle}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f4ecd8]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#241d14]/65 dark:text-[#f4ecd8]/55">
                  {feature.description}
                </p>
                <span className="mt-3 text-xs font-medium text-[#8a6420] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#e8c87a]">
                  Découvrir →
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <AnimatedSection className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
              À la une
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f4ecd8] md:text-3xl">
              Khassaïdes mis en avant
            </h2>
          </div>
          <Link
            href="/xamxam/livres"
            className="hidden text-sm font-medium text-[#8a6420] hover:underline dark:text-[#e8c87a] sm:inline"
          >
            Voir tout →
          </Link>
        </AnimatedSection>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featuredBooks.map((book, index) => (
            <AnimatedSection key={book.id} delay={index * 0.05}>
              <BookCard book={book} related={carouselBooks} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <AnimatedSection className="kx-panel grid grid-cols-2 gap-6 rounded-3xl p-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#8a6420] dark:text-[#e8c87a]">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#241d14]/55 dark:text-[#f4ecd8]/45">
                {stat.label}
              </p>
            </div>
          ))}
        </AnimatedSection>
      </section>
    </div>
  );
}
