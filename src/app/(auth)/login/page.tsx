/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page wrapper (SSR-safe)
   - Fixes Vercel build error:
     "useSearchParams() should be wrapped in a suspense boundary"
   - Forces dynamic rendering so /login is never prerendered
   ============================================================ */

import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

function Loading() {
  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Sign in</h1>
      <p style={{ marginTop: 12, opacity: 0.8 }}>Loading…</p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClient />
    </Suspense>
  );
}
