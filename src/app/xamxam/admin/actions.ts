"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireXamXamAdmin } from "@/lib/xamxam/auth";
import {
  XAMXAM_SESSION_COOKIE,
  XAMXAM_SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/xamxam/session";

function revalidatePublic() {
  revalidatePath("/xamxam");
  revalidatePath("/xamxam/livres");
  revalidatePath("/xamxam/playlists");
  revalidatePath("/xamxam/videos");
  revalidatePath("/xamxam/wirds");
}

// ---------------------------------------------------------------------------
// Authentification
// ---------------------------------------------------------------------------

export async function loginXamXamAdmin(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Identifiants requis." };

  const admin = await prisma.xamXamAdmin.findUnique({ where: { email } });
  if (!admin) return { error: "Identifiants incorrects." };

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return { error: "Identifiants incorrects." };

  const token = createSessionToken(admin.id);
  const store = await cookies();
  store.set(XAMXAM_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: XAMXAM_SESSION_MAX_AGE,
  });

  redirect("/xamxam/admin");
}

export async function logoutXamXamAdmin() {
  const store = await cookies();
  store.delete(XAMXAM_SESSION_COOKIE);
  redirect("/xamxam/admin/login");
}

// ---------------------------------------------------------------------------
// Livres
// ---------------------------------------------------------------------------

const bookSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  author: z.string().min(1, "L'auteur est requis"),
  language: z.enum(["WOLOF", "FRANCAIS", "ARABE"]),
  category: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.union([z.string().url(), z.literal("")]).optional(),
  pdfUrl: z.string().url("Lien PDF invalide"),
});

function readBookForm(formData: FormData) {
  return bookSchema.parse({
    title: formData.get("title"),
    author: formData.get("author") || "Serigne Touba Cheikh Ahmadou Bamba",
    language: formData.get("language"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
    coverUrl: formData.get("coverUrl") || "",
    pdfUrl: formData.get("pdfUrl"),
  });
}

export async function createBook(formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readBookForm(formData);
  await prisma.xamXamBook.create({
    data: {
      ...parsed,
      coverUrl: parsed.coverUrl || null,
      featured: formData.get("featured") === "on",
    },
  });
  revalidatePath("/xamxam/admin/books");
  revalidatePublic();
  redirect("/xamxam/admin/books");
}

export async function updateBook(id: string, formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readBookForm(formData);
  await prisma.xamXamBook.update({
    where: { id },
    data: {
      ...parsed,
      coverUrl: parsed.coverUrl || null,
      featured: formData.get("featured") === "on",
    },
  });
  revalidatePath("/xamxam/admin/books");
  revalidatePublic();
  redirect("/xamxam/admin/books");
}

export async function deleteBook(id: string) {
  await requireXamXamAdmin();
  await prisma.xamXamBook.delete({ where: { id } });
  revalidatePath("/xamxam/admin/books");
  revalidatePublic();
  redirect("/xamxam/admin/books");
}

// ---------------------------------------------------------------------------
// Playlists & pistes
// ---------------------------------------------------------------------------

const playlistSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  coverUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export async function createPlaylist(formData: FormData) {
  await requireXamXamAdmin();
  const parsed = playlistSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    coverUrl: formData.get("coverUrl") || "",
  });
  const playlist = await prisma.xamXamPlaylist.create({
    data: { ...parsed, coverUrl: parsed.coverUrl || null },
  });
  revalidatePath("/xamxam/admin/playlists");
  revalidatePublic();
  redirect(`/xamxam/admin/playlists/${playlist.id}`);
}

export async function updatePlaylist(id: string, formData: FormData) {
  await requireXamXamAdmin();
  const parsed = playlistSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    coverUrl: formData.get("coverUrl") || "",
  });
  await prisma.xamXamPlaylist.update({
    where: { id },
    data: { ...parsed, coverUrl: parsed.coverUrl || null },
  });
  revalidatePath(`/xamxam/admin/playlists/${id}`);
  revalidatePath("/xamxam/admin/playlists");
  revalidatePublic();
}

export async function deletePlaylist(id: string) {
  await requireXamXamAdmin();
  await prisma.xamXamPlaylist.delete({ where: { id } });
  revalidatePath("/xamxam/admin/playlists");
  revalidatePublic();
  redirect("/xamxam/admin/playlists");
}

const trackSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  reciter: z.string().optional(),
  audioUrl: z.string().url("Lien audio invalide"),
  duration: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

export async function addTrack(playlistId: string, formData: FormData) {
  await requireXamXamAdmin();
  const parsed = trackSchema.parse({
    title: formData.get("title"),
    reciter: formData.get("reciter") || undefined,
    audioUrl: formData.get("audioUrl"),
    duration: formData.get("duration") || undefined,
    order: formData.get("order") || 0,
  });
  await prisma.xamXamTrack.create({ data: { ...parsed, playlistId } });
  revalidatePath(`/xamxam/admin/playlists/${playlistId}`);
  revalidatePath(`/xamxam/playlists/${playlistId}`);
}

export async function deleteTrack(playlistId: string, trackId: string) {
  await requireXamXamAdmin();
  await prisma.xamXamTrack.delete({ where: { id: trackId } });
  revalidatePath(`/xamxam/admin/playlists/${playlistId}`);
  revalidatePath(`/xamxam/playlists/${playlistId}`);
}

// ---------------------------------------------------------------------------
// Vidéos
// ---------------------------------------------------------------------------

const videoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  videoUrl: z.string().url("Lien vidéo invalide"),
  thumbnailUrl: z.union([z.string().url(), z.literal("")]).optional(),
  category: z.string().optional(),
});

function readVideoForm(formData: FormData) {
  return videoSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    videoUrl: formData.get("videoUrl"),
    thumbnailUrl: formData.get("thumbnailUrl") || "",
    category: formData.get("category") || undefined,
  });
}

export async function createVideo(formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readVideoForm(formData);
  await prisma.xamXamVideo.create({
    data: { ...parsed, thumbnailUrl: parsed.thumbnailUrl || null },
  });
  revalidatePath("/xamxam/admin/videos");
  revalidatePublic();
  redirect("/xamxam/admin/videos");
}

export async function updateVideo(id: string, formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readVideoForm(formData);
  await prisma.xamXamVideo.update({
    where: { id },
    data: { ...parsed, thumbnailUrl: parsed.thumbnailUrl || null },
  });
  revalidatePath("/xamxam/admin/videos");
  revalidatePublic();
  redirect("/xamxam/admin/videos");
}

export async function deleteVideo(id: string) {
  await requireXamXamAdmin();
  await prisma.xamXamVideo.delete({ where: { id } });
  revalidatePath("/xamxam/admin/videos");
  revalidatePublic();
  redirect("/xamxam/admin/videos");
}

// ---------------------------------------------------------------------------
// Wirds
// ---------------------------------------------------------------------------

const wirdSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  moment: z.string().optional(),
  language: z.enum(["WOLOF", "FRANCAIS", "ARABE"]),
  content: z.string().min(1, "Le texte est requis"),
  audioUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

function readWirdForm(formData: FormData) {
  return wirdSchema.parse({
    title: formData.get("title"),
    moment: formData.get("moment") || undefined,
    language: formData.get("language"),
    content: formData.get("content"),
    audioUrl: formData.get("audioUrl") || "",
  });
}

export async function createWird(formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readWirdForm(formData);
  await prisma.xamXamWird.create({
    data: { ...parsed, audioUrl: parsed.audioUrl || null },
  });
  revalidatePath("/xamxam/admin/wirds");
  revalidatePublic();
  redirect("/xamxam/admin/wirds");
}

export async function updateWird(id: string, formData: FormData) {
  await requireXamXamAdmin();
  const parsed = readWirdForm(formData);
  await prisma.xamXamWird.update({
    where: { id },
    data: { ...parsed, audioUrl: parsed.audioUrl || null },
  });
  revalidatePath("/xamxam/admin/wirds");
  revalidatePublic();
  redirect("/xamxam/admin/wirds");
}

export async function deleteWird(id: string) {
  await requireXamXamAdmin();
  await prisma.xamXamWird.delete({ where: { id } });
  revalidatePath("/xamxam/admin/wirds");
  revalidatePublic();
  redirect("/xamxam/admin/wirds");
}
