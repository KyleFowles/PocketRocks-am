/* ============================================================
   FILE: src/lib/serverSession.ts
   PURPOSE: Server-only session helpers for pr_session cookie
   ============================================================ */

import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";

const COOKIE_NAME = "pr_session";

export async function requireUidOrRedirect(nextPath: string): Promise<string> {
  const jar = await cookies();
  const sessionCookie = jar.get(COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie!, true);
    return decoded.uid;
  } catch {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
}
