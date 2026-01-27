/* ============================================================
   FILE: src/app/api/session/route.ts
   PURPOSE:
     - POST: Create pr_session cookie from Firebase ID token
     - GET:  Report whether cookie exists AND verify it (returns uid)

   KEY:
   - In dev/localhost over http, cookie MUST NOT be secure:true
   - In prod/https, cookie SHOULD be secure:true
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";
const EXPIRES_DAYS = 5;
const EXPIRES_MS = EXPIRES_DAYS * 24 * 60 * 60 * 1000;

function shouldUseSecureCookie(req: NextRequest) {
  // Production should always be secure.
  if (process.env.NODE_ENV === "production") return true;

  // On dev behind https proxy, respect forwarded proto.
  const xfProto = req.headers.get("x-forwarded-proto");
  if (xfProto && xfProto.toLowerCase().includes("https")) return true;

  // Localhost over http -> MUST be false
  return false;
}

function extractBearer(req: NextRequest): string | null {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] || null;
}

export async function GET(req: NextRequest) {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value || null;

  if (!raw) {
    return NextResponse.json(
      { ok: true, hasSession: false, verified: false, uid: null, cookieName: COOKIE_NAME },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(raw, true);
    return NextResponse.json(
      { ok: true, hasSession: true, verified: true, uid: decoded.uid, cookieName: COOKIE_NAME },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "verifySessionCookie failed";
    return NextResponse.json(
      { ok: true, hasSession: true, verified: false, uid: null, cookieName: COOKIE_NAME, error: msg },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const bearer = extractBearer(req);

    const idToken: string | undefined =
      (typeof body?.idToken === "string" ? body.idToken : undefined) ||
      (typeof bearer === "string" ? bearer : undefined);

    if (!idToken) {
      return NextResponse.json(
        { ok: false, error: "Missing idToken (send JSON {idToken} or Authorization: Bearer <token>)" },
        { status: 400 }
      );
    }

    // Verify ID token (JWT)
    await adminAuth.verifyIdToken(idToken);

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_MS,
    });

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");

    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: shouldUseSecureCookie(req),
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(EXPIRES_MS / 1000),
    });

    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
