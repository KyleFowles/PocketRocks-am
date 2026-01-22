/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page wrapper with Suspense boundary
   ============================================================ */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginClient />
    </Suspense>
  );
}
