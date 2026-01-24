/* ============================================================
   FILE: src/app/(auth)/login/page.tsx

   PocketRocks — Login Page (Server Wrapper)

   Fix:
   - Wrap client-side search param usage in Suspense
   - Prevent prerender build failure

   ============================================================ */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
