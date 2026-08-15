import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majalis — Bibliothèque de Serigne Touba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Script id="majalis-theme-init" strategy="beforeInteractive">
          {"(function(){try{if(localStorage.getItem('majalis-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()"}
        </Script>
        {children}
      </body>
    </html>
  );
}
