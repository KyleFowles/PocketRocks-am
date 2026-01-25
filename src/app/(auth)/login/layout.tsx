/* ============================================================
   FILE: src/app/(auth)/login/layout.tsx
   PURPOSE: Login layout — passthrough
   NOTES:
   - (auth)/layout.tsx provides the shared header and page shell
   ============================================================ */

import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
