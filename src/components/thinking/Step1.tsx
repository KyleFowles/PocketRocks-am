/* ============================================================
   FILE: src/components/thinking/Step1.tsx
   PURPOSE: Step 1 — Guided Turns (canonical 4-turn flow)
            1) Orientation
            2) Reflection
            3) Pattern recognition (choice)
            4) Co-drafting confirmation
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import ThinkingSurface from "@/components/thinking/ThinkingSurface";
import ThinkingTurn, {
  TurnChoice,
  TurnInput,
} from "@/components/thinking/ThinkingTurn";

type Shift = "faster" | "clearer" | "followthrough" | "surprises" | "other";
type FinalPick = "tighten" | "adjust" | "right";

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

    if (b) {
      parts.push(
        `In 30 days, the first thing people would notice is: ${b}.`
      );
    }

    if (shiftLabel) {
      parts.push(`Primary shift: ${shiftLabel}.`);
    }

    return parts.join(" ");
  }, [t1, t2, shiftLabel]);

  return (
    <ThinkingSurface
      title="Step 1"
      subtitle="Turn a vague concern into a clear, shared problem."
    >
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
          systemOutput="Here’s the draft problem statement PocketRocks heard:"
          prompt="How should we proceed?"
          locked={locked4}
        >
          <div
            className="pr-surface"
            style={{
              padding: 14,
              marginBottom: 14,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.92 }}>
              {draft}
            </div>
          </div>

          <TurnChoice
            locked={locked4}
            options={["Tighten wording", "Adjust outcome", "This is right"]}
            onPick={(label) => {
              const map: Record<string, FinalPick> = {
                "Tighten wording": "tighten",
                "Adjust outcome": "adjust",
                "This is right": "right",
              };
              setT4(map[label] || "right");
            }}
          />

          {locked4 ? (
            <div style={{ marginTop: 14 }} className="pr-body">
              Step 1 complete. Next, we’ll turn this into a SMART goal with
              milestones.
            </div>
          ) : null}
        </ThinkingTurn>
      ) : null}
    </ThinkingSurface>
  );
}
