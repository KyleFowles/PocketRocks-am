/* ============================================================
   FILE: src/app/session/logout/route.ts
   PURPOSE:
   Clear the session cookie
   ============================================================ */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // must match login cookie path
    maxAge: 0,
  });

  return res;
}
