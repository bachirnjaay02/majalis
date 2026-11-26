import { Prisma } from "@prisma/client";

function isConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1001", "P1002", "P1008", "P1010", "P1017"].includes(error.code);
  }
  const message = error instanceof Error ? error.message : "";
  return /can't reach database server|connection refused|ECONNREFUSED|ENOTFOUND|ETIMEDOUT/i.test(
    message
  );
}

/**
 * Exécute une requête Prisma et bascule sur des données de démonstration
 * lorsque la base est injoignable **en développement** (le `.env` local ne
 * pointe pas encore vers Neon). En production, les erreurs remontent
 * normalement : on ne masque jamais une panne de base.
 */
export async function withFallback<T>(
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV !== "production" && isConnectionError(error)) {
      console.warn(
        "[majalis] Base de données injoignable — affichage des données de démonstration."
      );
      return fallback;
    }
    throw error;
  }
}
