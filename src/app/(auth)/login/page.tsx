/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page (Server Component) that wraps client login
            in Suspense to satisfy Next.js CSR bailout rules.
   ============================================================ */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
