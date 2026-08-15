import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroAnimation from "@/components/xamxam/HeroAnimation";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import BookCard from "@/components/xamxam/BookCard";

export const metadata: Metadata = {
  title: "Majalis — Bibliothèque de Serigne Touba",
};

const features = [
  {
    href: "/xamxam/livres",
    title: "Majalis",
    subtitle: "Livres",
    description:
      "Les écrits de Serigne Touba filtrables en wolof, français et arabe, lisibles en PDF.",
    glyph: "📖",
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

export default async function XamXamHome() {
  const [bookCount, playlistCount, videoCount, wirdCount, featuredBooks] =
    await Promise.all([
      prisma.xamXamBook.count(),
      prisma.xamXamPlaylist.count(),
      prisma.xamXamVideo.count(),
      prisma.xamXamWird.count(),
      prisma.xamXamBook.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    { label: "Livres", value: bookCount },
    { label: "Playlists", value: playlistCount },
    { label: "Vidéos", value: videoCount },
    { label: "Wirds", value: wirdCount },
  ];

  return (
    <div>
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-16 text-center md:pt-24">
        <HeroAnimation />

        <AnimatedSection>
          <p
            dir="rtl"
            lang="ar"
            className="font-[family-name:var(--font-xamxam-arabic)] text-2xl text-[#8a6420] dark:text-[#f3d27a] md:text-3xl"
          >
            مجالس
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-xamxam-display)] text-4xl font-semibold leading-tight text-[#241d14] dark:text-[#f3e9d2] md:text-6xl">
            waxxi SERIGNE TOUBA,
            <br className="hidden md:block" /> Si saay looxo.
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="mt-6 max-w-xl text-base text-[#241d14]/65 dark:text-[#f3e9d2]/65 md:text-lg">
            Majalis rassemble les livres, playlists, vidéos et wirds de Cheikh
            Ahmadou Bamba — en wolof, en français et en arabe — dans une
            application installable et accessible hors-ligne.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/xamxam/livres"
            className="rounded-full bg-gradient-to-r from-[#f3d27a] to-[#c9973a] px-7 py-3 text-sm font-semibold text-[#0c0c0a] shadow-[0_20px_40px_-15px_rgba(243,210,122,0.5)] transition-transform hover:scale-105"
          >
            Explorer la bibliothèque
          </Link>
          <Link
            href="/xamxam/wirds"
            className="rounded-full border border-[#f3d27a]/25 px-7 py-3 text-sm font-semibold text-[#241d14] dark:text-[#f3e9d2] transition-colors hover:border-[#f3d27a]/50"
          >
            Découvrir les wirds
          </Link>
        </AnimatedSection>

        <AnimatedSection
          delay={0.4}
          className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#8a6420] dark:text-[#f3d27a]">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#241d14]/50 dark:text-[#f3e9d2]/50">
                {s.label}
              </p>
            </div>
          ))}
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <AnimatedSection key={f.href} delay={i * 0.08}>
              <Link
                href={f.href}
                className="group flex h-full flex-col rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-6 transition-all hover:-translate-y-1.5 hover:border-[#f3d27a]/35 hover:bg-[#241d14]/[0.05] dark:hover:bg-white/[0.05]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3d27a]/20 to-[#c9973a]/10 text-xl">
                  {f.glyph}
                </span>
                <p className="mt-4 text-xs uppercase tracking-wider text-[#8a6420] dark:text-[#f3d27a]">
                  {f.subtitle}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-xamxam-display)] text-xl font-semibold text-[#241d14] dark:text-[#f3e9d2]">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#241d14]/55 dark:text-[#f3e9d2]/55">
                  {f.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] opacity-0 transition-opacity group-hover:opacity-100">
                  Découvrir →
                </span>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {featuredBooks.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <AnimatedSection className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
                À la une
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-3xl">
                Livres mis en avant
              </h2>
            </div>
            <Link
              href="/xamxam/livres"
              className="hidden text-sm font-medium text-[#8a6420] dark:text-[#f3d27a] hover:text-[#8a6420] dark:hover:text-[#f3d27a] sm:inline"
            >
              Voir tout →
            </Link>
          </AnimatedSection>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredBooks.map((book, i) => (
              <AnimatedSection key={book.id} delay={i * 0.06}>
                <BookCard book={book} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
