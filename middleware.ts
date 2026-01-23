/* ============================================================
   FILE: src/middleware.ts
   PURPOSE:
   Protect authenticated routes (including /step-1 and /thinking)
   Redirect to /login?next=... if no session cookie is present
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "pr_session";

function isPublicPath(pathname: string) {
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/signup")) return true;

  // session endpoints must stay public
  if (pathname.startsWith("/session/login")) return true;
  if (pathname.startsWith("/session/logout")) return true;

  // Next internals + assets
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/robots.txt")) return true;
  if (pathname.startsWith("/sitemap")) return true;

  return false;
}

function isProtectedPath(pathname: string) {
  // Protect the app thinking/step flow
  if (pathname === "/thinking" || pathname.startsWith("/thinking/")) return true;
  if (pathname === "/step-1" || pathname.startsWith("/step-")) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search || ""}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
