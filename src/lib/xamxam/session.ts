import { createHmac, timingSafeEqual } from "crypto";

// Session signing is intentionally independent from NextAuth: Majalis is a
// separate application and must keep working even if the school app's auth
// setup changes. We only reuse AUTH_SECRET because it's already the
// project's one long-lived secret — no new env var to configure.
const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

export const XAMXAM_SESSION_COOKIE = "xamxam_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours
export const XAMXAM_SESSION_MAX_AGE = SESSION_DURATION_MS / 1000;

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createSessionToken(adminId: string) {
  const payload = JSON.stringify({
    id: adminId,
    exp: Date.now() + SESSION_DURATION_MS,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(
  token: string | undefined | null
): { id: string } | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSig = Buffer.from(sign(encoded));
  const gotSig = Buffer.from(signature);
  if (expectedSig.length !== gotSig.length) return null;
  if (!timingSafeEqual(expectedSig, gotSig)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.id !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (Date.now() > payload.exp) return null;
    return { id: payload.id };
  } catch {
    return null;
  }
}
