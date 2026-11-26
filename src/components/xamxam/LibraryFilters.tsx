"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { languageOptions } from "@/lib/xamxam/labels";

export default function LibraryFilters({
  categories,
}: {
  categories: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const activeLang = searchParams.get("lang") ?? "";
  const activeCategory = searchParams.get("categorie") ?? "";

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const tabs: { value: string; label: string }[] = [
    { value: "", label: "Toutes les langues" },
    ...languageOptions,
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeLang === tab.value;
          return (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => updateParams({ lang: tab.value || null })}
              aria-pressed={active}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-[#241d14]"
                  : "border border-[#8a6420]/20 text-[#241d14]/70 hover:border-[#8a6420]/50 hover:text-[#241d14] dark:border-[#e8c87a]/15 dark:text-[#f4ecd8]/65 dark:hover:border-[#e8c87a]/40 dark:hover:text-[#f4ecd8]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="library-lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateParams({ q: e.target.value || null });
          }}
          type="search"
          placeholder="Rechercher un titre, un thème…"
          aria-label="Rechercher un khassaïde"
          className="w-full rounded-full border border-[#8a6420]/25 bg-white/75 px-5 py-2.5 text-sm text-[#241d14] outline-none placeholder:text-[#241d14]/40 focus:border-[#8a6420]/60 dark:border-[#e8c87a]/15 dark:bg-white/[0.04] dark:text-[#f4ecd8] dark:placeholder:text-[#f4ecd8]/35 dark:focus:border-[#e8c87a]/50 sm:max-w-xs"
        />

        {categories.length > 0 && (
          <select
            value={activeCategory}
            onChange={(e) => updateParams({ categorie: e.target.value || null })}
            aria-label="Filtrer par thématique"
            className="w-full rounded-full border border-[#8a6420]/25 bg-white px-4 py-2.5 text-sm text-[#241d14] outline-none focus:border-[#8a6420]/60 dark:border-[#e8c87a]/15 dark:bg-[#241d14] dark:text-[#f4ecd8] dark:focus:border-[#e8c87a]/50 sm:w-auto"
          >
            <option value="">Toutes les thématiques</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
