import type { Metadata } from "next";
import AnimatedSection from "@/components/xamxam/AnimatedSection";
import FavoritesView from "@/components/xamxam/FavoritesView";

export const metadata: Metadata = {
  title: "Majalis — Favoris",
};

export default function FavorisPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <AnimatedSection>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6420] dark:text-[#e8c87a]">
          Favoris
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f4ecd8] md:text-4xl">
          Votre bibliothèque personnelle
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/65 dark:text-[#f4ecd8]/60 md:text-base">
          Retrouvez les khassaïdes que vous avez mis de côté. Les favoris sont
          enregistrés sur cet appareil, sans compte ni connexion.
        </p>
      </AnimatedSection>

      <FavoritesView />
    </div>
  );
}
