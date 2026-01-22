/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE: One turn = one prompt + one user action + lock state
   ============================================================ */

"use client";

import React from "react";

export function ThinkingTurn({
  systemLead,
  systemOutput,
  prompt,
  locked,
  children,
}: {
  systemLead: string;
  systemOutput?: string;
  prompt: string;
  locked: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-xl border border-neutral-900 p-5 transition ${
        locked ? "opacity-80" : "opacity-100"
      }`}
    >
      <p className="text-sm text-neutral-300">{systemLead}</p>

      {systemOutput ? (
        <div className="mt-3 rounded-lg border border-neutral-900 bg-neutral-950/60 p-3 text-sm text-neutral-200">
          {systemOutput}
        </div>
      ) : null}

      <p className="mt-4 text-sm font-medium text-neutral-100">{prompt}</p>

      <div className="mt-4">{children}</div>
    </section>
  );
}
