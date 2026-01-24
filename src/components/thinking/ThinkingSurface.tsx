/* ============================================================
   FILE: src/components/thinking/ThinkingSurface.tsx
   PURPOSE:
   PocketRocks “Thinking Surface” — Step 1 (Guided Turn #1 only)
   - Calm thinking surface (no chat bubbles)
   - One active turn at a time
   - Completed turns remain visible and dim
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import ThinkingTurn, { type ThinkingTurnValue } from "./ThinkingTurn";
import LogoutButton from "@/components/LogoutButton";

type Turn1 = { kind: "t1"; value: ThinkingTurnValue };

export default function ThinkingSurface() {
  const [turn1, setTurn1] = useState<Turn1 | null>(null);

  const headline = useMemo(() => {
    return "PocketRocks";
  }, []);

  return (
    <main className="min-h-screen bg-[#0B1220]">
      {/* Top bar (self-contained so we don't have to touch your layouts) */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1220]/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div>
            <div className="text-lg font-bold text-white">{headline}</div>
            <div className="text-xs text-white/60">
              A calm place to think — one step at a time.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-12 pt-8">
        {/* Step title */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Step 1
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">
            Turn a vague concern into a clear problem
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            We’ll take this in small, guided turns. Write one sentence, then
            continue.
          </p>
        </div>

        {/* Turn 1: Orientation */}
        <div className="space-y-4">
          <ThinkingTurn
            index={0}
            title="Orientation"
            systemText="Start with one sentence. Don’t overthink it."
            prompt="What’s not working right now?"
            placeholder="Example: Our customer service is inconsistent."
            buttonLabel="Continue"
            locked={Boolean(turn1)}
            value={turn1?.value ?? null}
            onSubmit={(v) => setTurn1({ kind: "t1", value: v })}
          />

          {/* Next turn placeholder (not implemented yet — keeps flow obvious) */}
          <section className="rounded-2xl border border-white/10 bg-white/3 p-5 opacity-60">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Turn 2 · Reflection (next)
            </div>
            <div className="mt-3 text-sm text-white/70">
              After you complete Turn 1, we’ll reflect it back and ask one clear
              question.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
