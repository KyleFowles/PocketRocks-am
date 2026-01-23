/* ============================================================
   FILE: src/app/session/logout/route.ts
   PURPOSE:
   Clear session cookie (client calls this on logout).
   OUTPUT: { ok: true }
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";

export async function POST() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
