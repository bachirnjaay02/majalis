import type { XamXamLanguage } from "@prisma/client";

export const languageLabels: Record<XamXamLanguage, string> = {
  WOLOF: "Wolof",
  FRANCAIS: "Français",
  ARABE: "العربية",
};

export const languageBadgeClasses: Record<XamXamLanguage, string> = {
  WOLOF:
    "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  FRANCAIS:
    "bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30",
  ARABE:
    "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
};

export const languageOptions: { value: XamXamLanguage; label: string }[] = [
  { value: "WOLOF", label: "Wolof" },
  { value: "FRANCAIS", label: "Français" },
  { value: "ARABE", label: "العربية" },
];

export function isRtl(language: XamXamLanguage) {
  return language === "ARABE";
}

// Google Drive "share" links (…/file/d/ID/view or …/open?id=ID) return an
// HTML preview page, not the raw file, so <audio>/<img>/<a href=pdf> can't
// load them directly. Rewrite to the direct-content URL format instead.
export function normalizeDriveUrl(url: string): string {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  const id = fileMatch?.[1] ?? openMatch?.[1];
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

export function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}
