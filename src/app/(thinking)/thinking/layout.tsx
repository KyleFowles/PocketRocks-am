/* ============================================================
   FILE: src/app/(thinking)/thinking/layout.tsx
   PURPOSE: Thinking area layout (UI ONLY — no auth logic)
   ============================================================ */

import React from "react";

export default function ThinkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,121,0,0.14),transparent_55%),linear-gradient(to_bottom,#05070d,#07101c_55%,#04060b)]">
      {children}
    </div>
  );
}
