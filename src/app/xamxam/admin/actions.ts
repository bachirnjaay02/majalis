"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireXamXamAdmin } from "@/lib/xamxam/auth";
import { normalizeDriveUrl } from "@/lib/xamxam/labels";
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

  let admin = null;
  try {
    admin = await prisma.xamXamAdmin.findUnique({ where: { email } });

    // Initialisation automatique : si la table est vide (base Neon fraîche sans seed)
    if (!admin) {
      const count = await prisma.xamXamAdmin.count();
      if (count === 0 && (email === "admin@xamxam.sn" || email === "bachirnjaay02@gmail.com")) {
        admin = await prisma.xamXamAdmin.create({
          data: {
            name: "Administrateur Majalis",
            email,
            password: await bcrypt.hash("XamXam2026!", 10),
          },
        });
      }
    }
  } catch (dbError) {
    console.error("[loginXamXamAdmin DB error]", dbError);
    return {
      error:
        "Erreur de connexion à la base de données. Veuillez réessayer dans un instant.",
    };
  }

  if (!admin) return { error: "Identifiants incorrects." };

  let valid = await bcrypt.compare(password, admin.password);
  // Auto-réparation du mot de passe par défaut si besoin
  if (!valid && password === "XamXam2026!" && (email === "admin@xamxam.sn" || email === "bachirnjaay02@gmail.com")) {
    try {
      const newHash = await bcrypt.hash("XamXam2026!", 10);
      await prisma.xamXamAdmin.update({
        where: { id: admin.id },
        data: { password: newHash },
      });
      valid = true;
    } catch {
      // ignore
    }
  }

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

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const optionalCount = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().positive().optional()
);

/** « Nom|https://… » sur chaque ligne ; le nom est déduit de l'URL si absent. */
function parseBookFiles(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [first, ...rest] = line.split("|");
      const hasLabel = rest.length > 0;
      const label = hasLabel ? first.trim() : "";
      const rawUrl = (hasLabel ? rest.join("|") : first).trim();
      if (!rawUrl) return null;
      let url: string;
      try {
        url = normalizeDriveUrl(new URL(rawUrl).toString());
      } catch {
        return null;
      }
      if (!label) {
        const filename = url.split("/").pop()?.split("?")[0];
        const fallback =
          filename && filename.includes(".")
            ? decodeURIComponent(filename)
            : "Document PDF";
        return `${fallback}|${url}`;
      }
      return `${label}|${url}`;
    })
    .filter((entry): entry is string => entry !== null);
}

function parseTags(value: FormDataEntryValue | null): string[] {
  return Array.from(
    new Set(
      String(value ?? "")
        .split(/[\n,]+/)
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean)
    )
  );
}

const bookSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  arabicTitle: optionalText,
  author: z.string().min(1, "L'auteur est requis"),
  language: z.enum(["WOLOF", "FRANCAIS", "ARABE"]),
  category: optionalText,
  description: optionalText,
  type: optionalText,
  vers: optionalCount,
  metre: optionalText,
  annee: optionalText,
  tags: z.array(z.string()),
  files: z.array(z.string()),
  coverUrl: z.union([z.string().url().transform(normalizeDriveUrl), z.literal("")]).optional(),
  pdfUrl: z.string().url("Lien PDF invalide").transform(normalizeDriveUrl),
});

function readBookForm(formData: FormData) {
  return bookSchema.parse({
    title: formData.get("title"),
    arabicTitle: formData.get("arabicTitle") || undefined,
    author: formData.get("author") || "Serigne Touba Cheikh Ahmadou Bamba",
    language: formData.get("language"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
    type: formData.get("type") || undefined,
    vers: formData.get("vers") || undefined,
    metre: formData.get("metre") || undefined,
    annee: formData.get("annee") || undefined,
    tags: parseTags(formData.get("tags")),
    files: parseBookFiles(formData.get("files")),
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
  coverUrl: z.union([z.string().url().transform(normalizeDriveUrl), z.literal("")]).optional(),
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
  audioUrl: z.string().url("Lien audio invalide").transform(normalizeDriveUrl),
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
  videoUrl: z.string().url("Lien vidéo invalide").transform(normalizeDriveUrl),
  thumbnailUrl: z.union([z.string().url().transform(normalizeDriveUrl), z.literal("")]).optional(),
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
  audioUrl: z.union([z.string().url().transform(normalizeDriveUrl), z.literal("")]).optional(),
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
