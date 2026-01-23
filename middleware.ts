/* ============================================================
   FILE: middleware.ts
   PURPOSE:
   - If user hits /dashboard while signed in -> auto-redirect to /thinking
   - Protect /thinking and /dashboard -> redirect to /login if no session
   NOTES:
   - Uses cookie: pr_session
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "pr_session";

function buildRedirectUrl(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isThinking = pathname === "/thinking" || pathname.startsWith("/thinking/");

  if (!isDashboard && !isThinking) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  // Not signed in -> go to login, preserve where they were headed
  if (!hasSession) {
    const loginUrl = buildRedirectUrl(req, "/login");
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Signed in and on dashboard -> dashboard is a transit stop, go to thinking
  if (isDashboard) {
    const thinkingUrl = buildRedirectUrl(req, "/thinking");
    return NextResponse.redirect(thinkingUrl);
  }

  // Signed in and already on thinking -> allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/thinking/:path*"],
};
