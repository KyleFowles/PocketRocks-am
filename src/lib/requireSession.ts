/* ============================================================
   FILE: src/lib/requireSession.ts
   PURPOSE: Single source of truth for server-side session gating
            - Reads pr_session cookie
            - Verifies via Firebase Admin
            - Redirects to /login?next=... if missing/invalid
   ============================================================ */

import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const COOKIE_NAME = "pr_session";

function safeNext(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "/dashboard";
  if (!v.startsWith("/")) return "/dashboard";
  if (v.startsWith("//")) return "/dashboard";
  if (v.includes("://")) return "/dashboard";
  return v;
}

export async function requireSession(nextUrl: string): Promise<{ uid: string }> {
  const jar = await cookies();
  const sessionCookie = jar.get(COOKIE_NAME)?.value;

  const nextSafe = safeNext(nextUrl);

  if (!sessionCookie) {
    redirect(`/login?next=${encodeURIComponent(nextSafe)}`);
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { uid: decoded.uid };
  } catch {
    redirect(`/login?next=${encodeURIComponent(nextSafe)}`);
  }
}
