/* ============================================================
   FILE: src/components/thinking/Step1.tsx
   PURPOSE: Step 1 — Guided Turns (canonical 4-turn flow)
            1) Orientation
            2) Reflection
            3) Pattern recognition (choice)
            4) Co-drafting confirmation

   FIXES:
   - Single CTA only (no duplicate “Continue” buttons)
   - Tighter spacing (reduce below-the-fold)
   - Upgraded Turn 4 copy (designer-picked)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import ThinkingSurface from "@/components/thinking/ThinkingSurface";
import ThinkingTurn, { TurnChoice, TurnInput } from "@/components/thinking/ThinkingTurn";

type Shift = "faster" | "clearer" | "followthrough" | "surprises" | "other";
type FinalPick = "sharper" | "aim" | "lock";

function cleanOneLine(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

export default function Step1() {
  const [t1, setT1] = useState<string | null>(null);
  const [t2, setT2] = useState<string | null>(null);
  const [t3, setT3] = useState<Shift | null>(null);
  const [t4, setT4] = useState<FinalPick | null>(null);

  const locked1 = t1 !== null;
  const locked2 = t2 !== null;
  const locked3 = t3 !== null;
  const locked4 = t4 !== null;

  const shiftLabel = useMemo(() => {
    if (t3 === "faster") return "faster response";
    if (t3 === "clearer") return "clearer communication";
    if (t3 === "followthrough") return "more consistent follow-through";
    if (t3 === "surprises") return "fewer surprises";
    if (t3 === "other") return "a different shift";
    return "";
  }, [t3]);

  const draft = useMemo(() => {
    const a = cleanOneLine(t1 || "");
    const b = cleanOneLine(t2 || "");
    if (!a) return "";

    const parts: string[] = [];
    parts.push(a);

    if (b) parts.push(`In 30 days, the first thing people would notice is: ${b}.`);
    if (shiftLabel) parts.push(`Primary shift: ${shiftLabel}.`);

    return parts.join(" ");
  }, [t1, t2, shiftLabel]);

  function goNext() {
    window.location.href = "/thinking/step-2";
  }

  return (
    <ThinkingSurface title="Step 1" subtitle="Turn a vague concern into a clear, shared problem.">
      {/* Turn 1 */}
      <ThinkingTurn
        systemLead="Turn 1"
        systemOutput="Start simple. In one sentence: what’s not working?"
        prompt="Type one sentence."
        locked={locked1}
      >
        <TurnInput
          locked={locked1}
          value={t1 || ""}
          placeholder="e.g., Our customer service feels inconsistent."
          onSubmit={(val) => setT1(val)}
          ctaLabel="Continue"
        />
      </ThinkingTurn>

      {/* Turn 2 */}
      {locked1 ? (
        <ThinkingTurn
          systemLead="Turn 2"
          systemOutput={`Got it. You said: “${t1}”`}
          prompt="If this is better in 30 days, what would people notice first?"
          locked={locked2}
        >
          <TurnInput
            locked={locked2}
            value={t2 || ""}
            placeholder="e.g., Customers get answers within 1 business day."
            onSubmit={(val) => setT2(val)}
            ctaLabel="Continue"
          />
        </ThinkingTurn>
      ) : null}

      {/* Turn 3 */}
      {locked2 ? (
        <ThinkingTurn
          systemLead="Turn 3"
          systemOutput="Which shift is closest to what you want?"
          prompt="Pick one."
          locked={locked3}
        >
          <TurnChoice
            locked={locked3}
            options={[
              "Faster response",
              "Clearer communication",
              "More consistent follow-through",
              "Fewer surprises",
              "Something else",
            ]}
            onPick={(label) => {
              const map: Record<string, Shift> = {
                "Faster response": "faster",
                "Clearer communication": "clearer",
                "More consistent follow-through": "followthrough",
                "Fewer surprises": "surprises",
                "Something else": "other",
              };
              setT3(map[label] || "other");
            }}
          />
        </ThinkingTurn>
      ) : null}

      {/* Turn 4 */}
      {locked3 ? (
        <ThinkingTurn
          systemLead="Turn 4"
          systemOutput="Here’s what I heard. Choose one move."
          prompt="Lock the statement."
          locked={locked4}
        >
          {/* Draft panel (tight) */}
          <div
            style={{
              marginTop: 6,
              padding: 10,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.14)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                letterSpacing: "0.10em",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Current draft
            </div>

            <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.4, opacity: 0.94 }}>
              {draft}
            </div>
          </div>

          {/* Choices (new copy) */}
          <div style={{ marginTop: 10 }}>
            <TurnChoice
              locked={locked4}
              options={["Make it sharper", "Aim it at the real result", "Lock it in"]}
              onPick={(label) => {
                const map: Record<string, FinalPick> = {
                  "Make it sharper": "sharper",
                  "Aim it at the real result": "aim",
                  "Lock it in": "lock",
                };
                setT4(map[label] || "lock");
              }}
            />
          </div>

          {/* Helper + single CTA */}
          <div style={{ marginTop: 10 }}>
            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.35,
                opacity: locked4 ? 0.86 : 0.72,
                marginBottom: 8,
              }}
            >
              {locked4 ? "Locked. Next we make it SMART with milestones." : "One choice, then we move."}
            </div>

            <button
              type="button"
              className="pr-btn pr-btn-primary"
              onClick={goNext}
              disabled={!locked4}
              style={{
                width: "min(360px, 100%)",
                height: 42,
                fontWeight: 900,
                fontSize: 14.5,
              }}
            >
              Next: Make it SMART
            </button>
          </div>
        </ThinkingTurn>
      ) : null}
    </ThinkingSurface>
  );
}
