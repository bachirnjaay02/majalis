"use client";

import { useState } from "react";
import type { XamXamVideo } from "@prisma/client";
import { extractYoutubeId } from "@/lib/xamxam/labels";

export default function VideoCard({ video }: { video: XamXamVideo }) {
  const [active, setActive] = useState(false);
  const youtubeId = extractYoutubeId(video.videoUrl);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] transition-colors hover:border-[#f3d27a]/30">
      <div className="relative aspect-video overflow-hidden bg-[#f2e6c9] dark:bg-[#1c1a16]">
        {active ? (
          youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <video src={video.videoUrl} controls autoPlay className="h-full w-full" />
          )
        ) : (
          <button
            onClick={() => setActive(true)}
            className="group relative h-full w-full"
            aria-label={`Lire ${video.title}`}
          >
            {video.thumbnailUrl || youtubeId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  video.thumbnailUrl ??
                  `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                }
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f2e6c9] to-[#e6d3a4] dark:from-[#1c1a16] dark:to-[#0c0c0a] text-4xl">
                ▶
              </div>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f3d27a] to-[#c9973a] text-lg text-[#0c0c0a]">
                ▶
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-[family-name:var(--font-xamxam-display)] text-base font-semibold text-[#241d14] dark:text-[#f3e9d2]">
          {video.title}
        </h3>
        {video.category && (
          <span className="mt-2 inline-block rounded-full bg-[#f3d27a]/10 px-2.5 py-0.5 text-[11px] text-[#8a6420] dark:text-[#f3d27a]">
            {video.category}
          </span>
        )}
        {video.description && (
          <p className="mt-2 line-clamp-2 text-xs text-[#241d14]/55 dark:text-[#f3e9d2]/55">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
