/* ============================================================
   FILE: src/app/session/login/route.ts
   PURPOSE:
   Exchange Firebase ID token -> HttpOnly session cookie.
   CRITICAL:
   - Cookie Path MUST be "/" so it works for /step-1 AND /thinking
   ============================================================ */

import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";
const EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const idToken = typeof body?.idToken === "string" ? body.idToken : "";

    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();

    // Validate token
    await adminAuth.verifyIdToken(idToken);

    // Create cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // ✅ THIS is what keeps /step-1 from bouncing to /login
      maxAge: Math.floor(EXPIRES_IN_MS / 1000),
    });

    return res;
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Session login failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 401 });
  }
}
