"use client";

import { useSyncExternalStore } from "react";

const THEME_EVENT = "majalis-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

/** Le thème sombre est le rendu par défaut côté serveur. */
function getServerSnapshot() {
  return true;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("majalis-theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#8a6420]/25 text-[#241d14] transition-colors hover:border-[#8a6420]/60 dark:border-[#e8c87a]/20 dark:text-[#f4ecd8] dark:hover:border-[#e8c87a]/50 ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20.5 14.6a8.5 8.5 0 1 1-9.1-12A7 7 0 0 0 20.5 14.6Z" />
        </svg>
      )}
    </button>
  );
}
