/* ============================================================
   FILE: src/components/ui/AuthShell.tsx
   PURPOSE: Two-column auth layout (hero left, card right)
   NOTES:
   - title accepts React.ReactNode so callers can pass fragments
     with <br/> (no "as any" hacks).
   ============================================================ */

import React from "react";

export default function AuthShell({
  kicker = "NEW ACCOUNT",
  title,
  subtitle,
  cardTitle,
  children,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle: string;
  cardTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pr-auth-main">
      <section className="pr-hero">
        <div className="pr-hero-kicker">{kicker}</div>
        <h1 className="pr-hero-title">{title}</h1>
        <p className="pr-hero-sub">{subtitle}</p>
      </section>

      <section className="pr-card">
        <div className="pr-card-header">{cardTitle}</div>
        <div className="pr-card-body">{children}</div>
      </section>
    </div>
  );
}
