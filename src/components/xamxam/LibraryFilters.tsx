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
              onClick={() => updateParams({ lang: tab.value || null })}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "text-[#0c0c0a]" : "text-[#241d14]/70 dark:text-[#f3e9d2]/70 hover:text-[#241d14] dark:hover:text-[#f3e9d2]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="library-lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3d27a] to-[#c9973a]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className={!active ? "rounded-full border border-[#f3d27a]/15 px-0" : ""}>
                {tab.label}
              </span>
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
          placeholder="Rechercher un titre, un thème..."
          className="w-full rounded-xl border border-[#f3d27a]/15 bg-[#241d14]/[0.03] dark:bg-white/[0.03] px-4 py-2.5 text-sm text-[#241d14] dark:text-[#f3e9d2] placeholder:text-[#241d14]/35 dark:placeholder:text-[#f3e9d2]/35 outline-none focus:border-[#f3d27a]/50 sm:max-w-xs"
        />

        {categories.length > 0 && (
          <select
            value={activeCategory}
            onChange={(e) => updateParams({ categorie: e.target.value || null })}
            className="w-full rounded-xl border border-[#f3d27a]/15 bg-[#f2ead9] dark:bg-[#1c1a16] px-4 py-2.5 text-sm text-[#241d14] dark:text-[#f3e9d2] outline-none focus:border-[#f3d27a]/50 sm:w-auto"
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
