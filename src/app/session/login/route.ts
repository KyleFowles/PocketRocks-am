/* ============================================================
   FILE: src/app/session/login/route.ts
   PURPOSE: Exchange Firebase ID token -> HttpOnly session cookie
   ROUTE: POST /session/login
   BODY: { idToken: string }
   ============================================================ */

import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

const COOKIE_NAME = "pr_session";

// 14 days
const EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    // Verify token is legit
    await adminAuth.verifyIdToken(idToken);

    // Mint session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(EXPIRES_IN_MS / 1000),
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: typeof err?.message === "string" ? err.message : "Session login failed" },
      { status: 401 }
    );
  }
}
