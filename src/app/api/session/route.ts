/* ============================================================
   FILE: src/app/api/session/route.ts
   PURPOSE: Create a signed session cookie (pr_session) from a Firebase ID token.
   ============================================================ */

import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

const COOKIE_NAME = "pr_session";
const SESSION_DAYS = 14;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { idToken?: string };
    const idToken = body?.idToken;

    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing idToken" }, { status: 400 });
    }

    // Verify token belongs to a real Firebase user
    await adminAuth().verifyIdToken(idToken);

    // Mint session cookie
    const expiresIn = SESSION_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true });

    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(expiresIn / 1000),
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Session creation failed" },
      { status: 500 }
    );
  }
}
