/* ============================================================
   FILE: src/components/ui/AuthShell.tsx
   PURPOSE: Shared Tailwind shell for auth pages (login/signup)
   ============================================================ */

import React from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pr-bg flex items-start justify-center px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl overflow-hidden">
        <header className="px-6 py-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-white/70">{subtitle}</p> : null}
        </header>

        <div className="px-6 py-6">{children}</div>
      </section>
    </main>
  );
}
