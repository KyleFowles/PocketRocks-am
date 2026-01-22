/* ============================================================
   FILE: middleware.ts
   PURPOSE: Protect /thinking route -> redirect to /login if no session
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "pr_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect thinking area
  if (pathname.startsWith("/thinking")) {
    const hasSession = req.cookies.get(COOKIE_NAME)?.value;
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/thinking/:path*"],
};
