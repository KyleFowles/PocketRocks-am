/* ============================================================
   FILE: src/components/ui/PageShell.tsx
   PURPOSE: Shared “beautiful” page shell used across all screens.
   ============================================================ */

import React from "react";

export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="pr-shell">
      <section className="pr-card">
        <header className="pr-header">
          <h1 className="pr-title">{title}</h1>
          {subtitle ? <p className="pr-subtitle">{subtitle}</p> : null}
        </header>
        <div className="pr-body">{children}</div>
      </section>
    </main>
  );
}
