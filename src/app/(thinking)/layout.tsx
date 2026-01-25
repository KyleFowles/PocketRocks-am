/* ============================================================
   FILE: src/app/thinking/layout.tsx
   PURPOSE: Layout wrapper for /thinking routes
   ============================================================ */

import React from "react";

export const dynamic = "force-dynamic";

export default function ThinkingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
