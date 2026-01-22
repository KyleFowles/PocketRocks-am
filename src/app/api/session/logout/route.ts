/* ============================================================
   FILE: src/app/api/session/logout/route.ts
   PURPOSE: Clear session cookie
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";

export async function POST() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
