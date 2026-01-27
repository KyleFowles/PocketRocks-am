/* ============================================================
   FILE: src/components/thinking/Step2.tsx
   PURPOSE: Step 2 — SMART shaping doorway (placeholder, but real route)
            Keeps Guided Turns style and gives a clear next step.
   ============================================================ */

"use client";

import React from "react";
import ThinkingSurface from "@/components/thinking/ThinkingSurface";
import ThinkingTurn from "@/components/thinking/ThinkingTurn";

export default function Step2() {
  return (
    <ThinkingSurface
      title="Step 2"
      subtitle="Turn the problem into a SMART goal with clear milestones."
    >
      <ThinkingTurn
        systemLead="Step 2"
        systemOutput="You made it. This is the next doorway."
        prompt="Next up: SMART + milestones."
        locked={false}
      >
        <div className="pr-body" style={{ opacity: 0.9, lineHeight: 1.6 }}>
          Step 2 is now live as a route so you never hit a dead-end.
          <br />
          <br />
          Next build: the Guided Turns for SMART (S → M → A → R → T), then
          milestone drafting.
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className="pr-primary"
            onClick={() => (window.location.href = "/thinking/step-1")}
            style={{ minWidth: 220 }}
          >
            Back to Step 1
          </button>

          <button
            type="button"
            className="pr-ghost"
            onClick={() => (window.location.href = "/dashboard")}
            style={{ minWidth: 180 }}
          >
            Dashboard
          </button>
        </div>
      </ThinkingTurn>
    </ThinkingSurface>
  );
}
