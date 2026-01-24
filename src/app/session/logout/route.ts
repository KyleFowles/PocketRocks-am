/* ============================================================
   FILE: src/app/session/logout/route.ts
   PURPOSE: Clear HttpOnly session cookie
   ROUTE: POST /session/logout
   ============================================================ */

import { NextResponse } from "next/server";

const COOKIE_NAME = "pr_session";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
