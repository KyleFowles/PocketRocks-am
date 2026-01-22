/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page wrapper (SSR-safe)
   - Fixes Vercel prerender error:
     "useSearchParams() should be wrapped in a suspense boundary"
   - Forces dynamic rendering so /login is never prerendered
   - Passes required nextUrl prop into LoginClient
   ============================================================ */

import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function Loading() {
  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Sign in</h1>
      <p style={{ marginTop: 12, opacity: 0.8 }}>Loading…</p>
    </main>
  );
}

function pickNextUrl(searchParams?: PageProps["searchParams"]) {
  const raw = searchParams?.next;

  // Support ?next=/path or ?next=/path&next=/other
  const next = Array.isArray(raw) ? raw[0] : raw;

  if (typeof next !== "string" || !next.trim()) return "/";

  // Safety: only allow relative paths
  if (!next.startsWith("/")) return "/";

  return next;
}

export default function LoginPage({ searchParams }: PageProps) {
  const nextUrl = pickNextUrl(searchParams);

  return (
    <Suspense fallback={<Loading />}>
      <LoginClient nextUrl={nextUrl} />
    </Suspense>
  );
}
