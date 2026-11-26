"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { KhassaideBook } from "@/lib/xamxam/types";
import { readFavorites, subscribeFavorites } from "@/lib/xamxam/favorites";
import BookCard from "./BookCard";

export default function FavoritesView() {
  const [favorites, setFavorites] = useState<KhassaideBook[] | null>(null);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    return subscribeFavorites(sync);
  }, []);

  if (favorites === null) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse rounded-2xl border border-[#8a6420]/15 bg-black/[0.02] dark:border-[#e8c87a]/10 dark:bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="kx-panel mt-8 rounded-3xl p-8 text-center">
        <p className="font-[family-name:var(--font-xamxam-display)] text-xl font-semibold text-[#241d14] dark:text-[#f4ecd8]">
          Votre bibliothèque personnelle est vide
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[#241d14]/65 dark:text-[#f4ecd8]/55">
          Ouvrez une fiche khassaïde et appuyez sur « Favori » pour la
          retrouver ici, même hors connexion.
        </p>
        <Link
          href="/xamxam/livres"
          className="mt-5 inline-block rounded-full bg-gradient-to-r from-[#f3dd9f] via-[#e8c87a] to-[#c9a24a] px-5 py-2.5 text-sm font-semibold text-[#241d14]"
        >
          Parcourir les khassaïdes
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {favorites.map((book) => (
        <BookCard key={book.id} book={book} related={favorites} />
      ))}
    </div>
  );
}
