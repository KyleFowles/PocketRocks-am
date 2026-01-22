/* ============================================================
   FILE: src/app/(auth)/layout.tsx
   PURPOSE: Shared layout for /login and /signup
            (ONE header, clean, consistent)
   ============================================================ */

import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="app-header">
        <div>
          <div className="brand">
            <span className="brand-dot" />
            <span>PocketRocks</span>
          </div>
          <div className="brand-sub">The default place people go to think.</div>
        </div>

        <div className="badge">Private by design • Calm by default</div>
      </header>

      <main className="auth-wrap">{children}</main>
    </>
  );
}
