"use client";

import { useState } from "react";

type WirdItem = {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string | null;
  repeat: string;
};

type WirdFamily = {
  name: string;
  nameArabic: string;
  items: WirdItem[];
};

const order = ["al-xafiif", "al-kaamil", "al-xaatam"] as const;

export default function WirdMahfuzView({
  data,
}: {
  data: Record<string, WirdFamily>;
}) {
  const [active, setActive] = useState<(typeof order)[number]>("al-xafiif");
  const family = data[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {order.map((slug) => {
          const isActive = slug === active;
          const f = data[slug];
          return (
            <button
              key={slug}
              onClick={() => setActive(slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-[#f3d27a] to-[#c9973a] text-[#241d14]"
                  : "border border-[#f3d27a]/20 text-[#241d14]/70 hover:text-[#241d14] dark:text-[#f3e9d2]/70 dark:hover:text-[#f3e9d2]"
              }`}
            >
              {f.name}{" "}
              <span className="font-[family-name:var(--font-xamxam-arabic)]">({f.nameArabic})</span>
              <span className="ml-1.5 opacity-60">· {f.items.length}</span>
            </button>
          );
        })}
      </div>

      <ol className="mt-8 flex flex-col gap-4">
        {family.items.map((item, i) => (
          <li
            key={item.id}
            className="rounded-2xl border border-[#f3d27a]/12 bg-[#241d14]/[0.03] p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3d27a]/15 text-[11px] font-semibold text-[#8a6420] dark:text-[#f3d27a]">
                {i + 1}
              </span>
              <span className="shrink-0 rounded-full bg-[#f3d27a]/15 px-2.5 py-1 text-[11px] font-medium text-[#8a6420] dark:text-[#f3d27a]">
                ×{item.repeat}
              </span>
            </div>
            <p
              dir="rtl"
              lang="ar"
              className="mt-3 font-[family-name:var(--font-xamxam-arabic)] text-xl leading-loose text-[#241d14] dark:text-[#f3e9d2]"
            >
              {item.arabic}
            </p>
            <p className="mt-2 text-sm italic text-[#241d14]/55 dark:text-[#f3e9d2]/55">
              {item.transliteration}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
