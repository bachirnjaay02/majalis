import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { XAMXAM_SESSION_COOKIE, verifySessionToken } from "@/lib/xamxam/session";

// Guards the Majalis admin section with its own signed cookie (see
// src/lib/xamxam/session.ts). Everything else stays public.
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminSession = !!verifySessionToken(
    req.cookies.get(XAMXAM_SESSION_COOKIE)?.value
  );

  if (pathname === "/xamxam/admin/login") {
    if (isAdminSession) {
      return NextResponse.redirect(new URL("/xamxam/admin", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/xamxam/admin") && !isAdminSession) {
    const loginUrl = new URL("/xamxam/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|xamxam-manifest.webmanifest|xamxam-sw.js|xamxam-offline.html|xamxam-icons).*)",
  ],
};
