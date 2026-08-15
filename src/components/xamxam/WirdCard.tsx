"use client";

import { useState } from "react";
import type { XamXamWird } from "@prisma/client";
import { isRtl, languageBadgeClasses, languageLabels } from "@/lib/xamxam/labels";

export default function WirdCard({ wird }: { wird: XamXamWird }) {
  const [expanded, setExpanded] = useState(false);
  const rtl = isRtl(wird.language);

  return (
    <div className="rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] dark:bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-xamxam-display)] text-lg font-semibold text-[#241d14] dark:text-[#f3e9d2]">
            {wird.title}
          </h3>
          {wird.moment && (
            <p className="mt-0.5 text-xs text-[#8a6420] dark:text-[#f3d27a]">{wird.moment}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${languageBadgeClasses[wird.language]}`}
        >
          {languageLabels[wird.language]}
        </span>
      </div>

      <p
        dir={rtl ? "rtl" : "ltr"}
        lang={rtl ? "ar" : undefined}
        className={`mt-4 whitespace-pre-line text-sm leading-relaxed text-[#241d14]/80 dark:text-[#f3e9d2]/80 ${
          rtl ? "font-[family-name:var(--font-xamxam-arabic)] text-lg" : ""
        } ${expanded ? "" : "line-clamp-4"}`}
      >
        {wird.content}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-medium text-[#8a6420] dark:text-[#f3d27a] hover:underline"
        >
          {expanded ? "Réduire" : "Lire le texte complet"}
        </button>
        {wird.audioUrl && (
          <audio controls src={wird.audioUrl} className="h-8 max-w-full flex-1" />
        )}
      </div>
    </div>
  );
}
