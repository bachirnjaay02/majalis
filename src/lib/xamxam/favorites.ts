"use client";

import type { KhassaideBook } from "./types";

const STORAGE_KEY = "majalis-favorites";
const CHANGE_EVENT = "majalis-favorites-change";

export function readFavorites(): KhassaideBook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as KhassaideBook[]) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return readFavorites().some((book) => book.id === id);
}

export function toggleFavorite(book: KhassaideBook): boolean {
  const favorites = readFavorites();
  const exists = favorites.some((item) => item.id === book.id);
  const next = exists
    ? favorites.filter((item) => item.id !== book.id)
    : [book, ...favorites];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (navigation privée) : le favori ne persiste pas.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return !exists;
}

export function subscribeFavorites(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
