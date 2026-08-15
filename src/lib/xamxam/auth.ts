import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { XAMXAM_SESSION_COOKIE, verifySessionToken } from "./session";

export async function getXamXamAdmin() {
  const store = await cookies();
  const session = verifySessionToken(store.get(XAMXAM_SESSION_COOKIE)?.value);
  if (!session) return null;

  const admin = await prisma.xamXamAdmin.findUnique({
    where: { id: session.id },
  });
  return admin;
}

export async function requireXamXamAdmin() {
  const admin = await getXamXamAdmin();
  if (!admin) {
    throw new Error("Accès refusé : connexion administrateur Majalis requise.");
  }
  return admin;
}
