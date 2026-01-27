/* ============================================================
   FILE: src/app/(thinking)/layout.tsx
   PURPOSE: Thinking area layout (NO redirects here)
            - Redirects belong in pages via requireSession()
   ============================================================ */

import React from "react";

export default function ThinkingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
