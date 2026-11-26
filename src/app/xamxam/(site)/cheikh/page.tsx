import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export const metadata: Metadata = {
  title: "Majalis — Le Cheikh",
};

const timeline = [
  {
    year: "1853",
    title: "Naissance à Mbacké",
    text: "Cheikh Ahmadou Bamba naît à Mbacké-Baol, dans le royaume du Baol, de Serigne Momar Anta Saly Mbacké et de Mame Diarra Bousso.",
  },
  {
    year: "1883",
    title: "La voie mouride",
    text: "Après la disparition de son père, il choisit d'éduquer ses disciples par la ferveur spirituelle (tarbiya) plutôt que par la seule étude : la Mouridiyya prend forme.",
  },
  {
    year: "1887",
    title: "Fondation de Touba",
    text: "Il fonde Touba, cité vouée à l'adoration, à l'étude et à l'éducation spirituelle, devenue depuis le cœur du mouridisme.",
  },
  {
    year: "1895",
    title: "L'exil au Gabon",
    text: "Arrêté sur la route de Djéwol, il est déporté au Gabon par l'administration coloniale. Il y restera sept années, à Mayumba puis Lambaréné.",
  },
  {
    year: "1902",
    title: "Retour triomphal",
    text: "Le 11 novembre 1902, il retrouve Dakar et les siens, qui le croyaient disparu. Le Magal commémore chaque année le départ en exil.",
  },
  {
    year: "1903",
    title: "L'exil en Mauritanie",
    text: "Exilé de nouveau, il séjourne auprès du cheikh Sidia Baba jusqu'en 1907, avant de revenir au Sénégal.",
  },
  {
    year: "1912",
    title: "Diourbel",
    text: "Assigné à résidence à Diourbel, il y poursuit son enseignement et y compose une large part de son œuvre.",
  },
  {
    year: "1927",
    title: "Disparition",
    text: "Il s'éteint le 19 juillet 1927 à Diourbel. Son corps est transporté à Touba, où repose le fondateur de la cité sainte.",
  },
];

export default function CheikhPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <AnimatedSection>
        <div className="kx-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e8c87a]/10 blur-2xl" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
            Le Cheikh
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold leading-tight text-[#241d14] dark:text-[#f4ecd8] sm:text-4xl">
            Cheikh Ahmadou Bamba
          </h1>
          <p
            dir="rtl"
            className="mt-1 font-[family-name:var(--font-xamxam-arabic)] text-2xl text-[#8a6420] dark:text-[#e8c87a]/90"
          >
            الشيخ أحمد بمبا
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#241d14]/50 dark:text-[#f4ecd8]/45">
            1853 — 1927 · Khadimou Rassoul · Serigne Touba
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#241d14]/75 dark:text-[#f4ecd8]/70">
            Théologien, juriste et maître soufi, Cheikh Ahmadou Bamba a marqué
            profondément le Sénégal et l&apos;Afrique de l&apos;Ouest. Son œuvre
            — des milliers de vers et de traités — et sa cité de Touba
            demeurent, pour les mourides, une voie de foi, de travail et de
            service.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Son œuvre",
              value: "Des milliers de vers",
              text: "Qacidas, traités et invocations, transmis jusqu'à aujourd'hui.",
            },
            {
              label: "Sa cité",
              value: "Touba",
              text: "Fondée en 1887, devenue le cœur spirituel du mouridisme.",
            },
            {
              label: "Sa voie",
              value: "La Mouridiyya",
              text: "Foi, travail, discipline et service du Prophète (PSL).",
            },
          ].map((item) => (
            <div key={item.label} className="kx-panel rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#e8c87a]/80">
                {item.label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f4ecd8]">
                {item.value}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#241d14]/65 dark:text-[#f4ecd8]/55">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
            Repères
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-2xl font-semibold text-[#241d14] dark:text-[#f4ecd8]">
            Les grandes étapes d&apos;une vie
          </h2>

          <ol className="mt-6 space-y-3 border-l border-[#8a6420]/20 pl-5 dark:border-[#e8c87a]/15">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border border-[#8a6420]/60 bg-white dark:border-[#e8c87a]/60 dark:bg-[#1b1710]" />
                <p className="text-xs font-semibold tracking-wider text-[#8a6420] dark:text-[#e8c87a]">
                  {item.year}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-xamxam-display)] text-base font-semibold text-[#241d14] dark:text-[#f4ecd8]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#241d14]/65 dark:text-[#f4ecd8]/55">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <blockquote className="mt-10 rounded-3xl border border-[#8a6420]/25 bg-[#8a6420]/5 p-6 text-center dark:border-[#e8c87a]/20 dark:bg-[#e8c87a]/5">
          <p
            dir="rtl"
            className="font-[family-name:var(--font-xamxam-arabic)] text-xl leading-relaxed text-[#8a6420] dark:text-[#e8c87a]"
          >
            مَنْ عَرَفَ نَفْسَهُ فَقَدْ عَرَفَ رَبَّهُ
          </p>
          <p className="mt-2 text-sm italic text-[#241d14]/75 dark:text-[#f4ecd8]/65">
            « Celui qui se connaît lui-même connaît son Seigneur. »
          </p>
        </blockquote>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/xamxam/livres"
            className="rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-5 py-2.5 text-sm font-semibold text-[#241d14]"
          >
            Lire ses khassaïdes
          </Link>
          <Link
            href="/xamxam/agenda"
            className="rounded-full border border-[#8a6420]/30 px-5 py-2.5 text-sm font-medium text-[#241d14]/85 transition-colors hover:border-[#8a6420]/60 hover:text-[#8a6420] dark:border-[#e8c87a]/25 dark:text-[#f4ecd8]/80 dark:hover:border-[#e8c87a]/60 dark:hover:text-[#e8c87a]"
          >
            Voir le Magal et les grands rendez-vous
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
