/* ============================================================
   FILE: src/app/(auth)/login/layout.tsx
   PURPOSE: Login layout — content only (no brand/header)
   ============================================================ */

import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
