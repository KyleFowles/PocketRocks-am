/* ============================================================
   FILE: src/app/(auth)/signup/page.tsx

   PocketRocks — Signup Page (Server Wrapper)

   Fix:
   - Wrap client-side search param usage in Suspense
   - Prevent prerender build failure when useSearchParams is used

   ============================================================ */

import { Suspense } from "react";
import SignupClient from "./SignupClient";

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <SignupClient />
    </Suspense>
  );
}
