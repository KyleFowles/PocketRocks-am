/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE:
   - Canonical PocketRocks Turn Component
   - Built-in Input + Choice helpers
   - Prevents auto-advance bugs
   - One action per turn, locked after submit
   ============================================================ */

"use client";

import React, { useState } from "react";

/* ============================================================
   BASE TURN WRAPPER
   ============================================================ */

export default function ThinkingTurn({
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
      className={`rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 transition ${
        locked ? "opacity-70" : "opacity-100"
      }`}
    >
      <p className="text-sm font-semibold text-neutral-300">{systemLead}</p>

      {systemOutput ? (
        <div className="mt-3 rounded-xl border border-neutral-900 bg-black/30 p-3 text-sm text-neutral-200">
          {systemOutput}
        </div>
      ) : null}

      <p className="mt-4 text-sm font-medium text-neutral-100">{prompt}</p>

      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ============================================================
   TURN INPUT (one-line + Continue)
   ============================================================ */

export function TurnInput({
  value,
  onSubmit,
  locked,
  placeholder,
  ctaLabel = "Continue",
}: {
  value: string;
  onSubmit: (val: string) => void;
  locked: boolean;
  placeholder: string;
  ctaLabel?: string;
}) {
  const [local, setLocal] = useState(value);

  return (
    <div className="grid gap-3">
      <input
        value={local}
        disabled={locked}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        className="h-12 rounded-xl border border-neutral-800 bg-black/30 px-4 text-sm text-white outline-none focus:border-orange-500"
      />

      <button
        type="button"
        disabled={locked || local.trim().length < 2}
        onClick={() => onSubmit(local.trim())}
        className="h-12 rounded-xl bg-orange-500 font-semibold text-white disabled:opacity-40"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

/* ============================================================
   TURN CHOICE (button list)
   ============================================================ */

export function TurnChoice({
  options,
  onPick,
  locked,
}: {
  options: string[];
  onPick: (val: string) => void;
  locked: boolean;
}) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          disabled={locked}
          onClick={() => onPick(opt)}
          className="w-full rounded-xl border border-neutral-800 bg-black/20 px-4 py-3 text-left text-sm text-white hover:border-orange-500 disabled:opacity-50"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
