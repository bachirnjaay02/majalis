"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { languageOptions } from "@/lib/xamxam/labels";

export default function WirdFilters({ moments }: { moments: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeLang = searchParams.get("lang") ?? "";
  const activeMoment = searchParams.get("moment") ?? "";

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

  const tabs = [{ value: "", label: "Toutes les langues" }, ...languageOptions];

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
                  layoutId="wird-lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3d27a] to-[#c9973a]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {moments.length > 0 && (
        <select
          value={activeMoment}
          onChange={(e) => updateParams({ moment: e.target.value || null })}
          className="w-full rounded-xl border border-[#f3d27a]/15 bg-[#f2ead9] dark:bg-[#1c1a16] px-4 py-2.5 text-sm text-[#241d14] dark:text-[#f3e9d2] outline-none focus:border-[#f3d27a]/50 sm:w-auto"
        >
          <option value="">Tous les moments</option>
          {moments.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
