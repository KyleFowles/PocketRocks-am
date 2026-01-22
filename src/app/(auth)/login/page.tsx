/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page wrapper (Server Component)
            - Wraps client logic in Suspense to satisfy Next build
   ============================================================ */

import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic"; // prevents static prerender issues on hosts like Vercel

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
