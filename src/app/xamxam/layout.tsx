import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Amiri, Cormorant_Garamond } from "next/font/google";
import XamXamServiceWorker from "@/components/xamxam/XamXamServiceWorker";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-xamxam-display",
});

const arabicFont = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-xamxam-arabic",
});

export const metadata: Metadata = {
  title: {
    default: "Majalis — Bibliothèque de Serigne Touba",
    template: "%s · Majalis",
  },
  description:
    "Livres, playlists, vidéos et wirds de Serigne Touba Cheikh Ahmadou Bamba, en wolof, français et arabe.",
  manifest: "/xamxam-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Majalis",
  },
  icons: {
    icon: [
      { url: "/xamxam-icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/xamxam-icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/xamxam-icons/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#aaa9a6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function XamXamLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${displayFont.variable} ${arabicFont.variable} relative min-h-screen overflow-x-clip bg-[#faf6ec] font-[family-name:var(--font-xamxam-display)] text-[#241d14] antialiased dark:bg-[#0c0c0a] dark:text-[#f3e9d2]`}
    >
      <div aria-hidden className="mj-ambient pointer-events-none fixed inset-0 -z-10" />
      <XamXamServiceWorker />
      {children}
    </div>
  );
}
