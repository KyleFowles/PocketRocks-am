/* ============================================================
   FILE: src/app/session/login/route.ts
   PURPOSE: Create a server-side session cookie from a Firebase
            ID token and store it as an HTTP-only cookie.
   COMPATIBILITY:
   - Next.js 16+ (cookies() is async and must be awaited)
   ============================================================ */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

const COOKIE_NAME = "pr_session";
const EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) throw new Error("Missing FIREBASE_PRIVATE_KEY");
  return key.replace(/\\n/g, "\n");
}

function getAdminAuth() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");
    if (!clientEmail) throw new Error("Missing FIREBASE_CLIENT_EMAIL");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: getPrivateKey(),
      }),
    });
  }

  return admin.auth();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing idToken" },
        { status: 400 }
      );
    }

    const auth = getAdminAuth();

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    // Next.js 16+: cookies() is async
    const jar = await cookies();

    jar.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(EXPIRES_IN_MS / 1000),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Login failed" },
      { status: 500 }
    );
  }
}
