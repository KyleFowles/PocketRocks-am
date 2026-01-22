/* ============================================================
   FILE: src/app/api/session/login/route.ts
   PURPOSE: Exchange Firebase ID token for secure session cookie
   ============================================================ */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const auth = getAdminAuth();

    // 14 days session
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(expiresIn / 1000),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Could not create session" }, { status: 401 });
  }
}
