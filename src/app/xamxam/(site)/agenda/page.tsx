import type { Metadata } from "next";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import AgendaView from "@/components/xamxam/AgendaView";

export const metadata: Metadata = {
  title: "Majalis — Agenda",
};

export default function AgendaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AnimatedSection>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
          Agenda
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f4ecd8] md:text-4xl">
          Les grands rendez-vous de l&apos;année
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/65 dark:text-[#f4ecd8]/60 md:text-base">
          Ramadan, Korité, Tabaski, Magal de Touba, Gamou… Retrouvez les dates
          hégiriennes et grégoriennes des grands événements, et ajoutez-les à
          votre calendrier en un geste.
        </p>
      </AnimatedSection>

      <div className="mt-8">
        <AgendaView />
      </div>
    </div>
  );
}
