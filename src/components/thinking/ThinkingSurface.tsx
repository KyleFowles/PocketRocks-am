/* ============================================================
   FILE: src/components/thinking/ThinkingSurface.tsx
   PURPOSE: Centered, calm thinking surface (not chat UI)
   ============================================================ */

"use client";

import React from "react";

export function ThinkingSurface({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <h1 className="text-lg tracking-tight">
                <span className="pr-brand">PocketRocks</span>
              </h1>
            </div>
            {subtitle ? (
              <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">{rightSlot}</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <div className="mt-6 space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
