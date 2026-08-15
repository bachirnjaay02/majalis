import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import VideoCard from "@/components/xamxam/VideoCard";
import AnimatedSection from "@/components/xamxam/AnimatedSection";

export const metadata: Metadata = {
  title: "Majalis — Vidéos",
};

export default async function VideosPage() {
  const videos = await prisma.xamXamVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <AnimatedSection>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#8a6420] dark:text-[#f3d27a]">
          Vidéos
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-xamxam-display)] text-3xl font-semibold text-[#241d14] dark:text-[#f3e9d2] md:text-4xl">
          Conférences et enseignements filmés
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#241d14]/60 dark:text-[#f3e9d2]/60 md:text-base">
          Cheikhs, oustaz et conférenciers présentent la vie et l&apos;œuvre
          de Serigne Touba.
        </p>
      </AnimatedSection>

      {videos.length === 0 ? (
        <p className="mt-16 text-center text-sm text-[#241d14]/50 dark:text-[#f3e9d2]/50">
          Aucune vidéo disponible pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <AnimatedSection key={video.id} delay={Math.min(i * 0.05, 0.3)}>
              <VideoCard video={video} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
