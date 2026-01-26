/* ============================================================
   FILE: src/components/thinking/Step1.tsx
   PURPOSE: Step 1 — Guided Turns (stable locking)
            - Draft input does NOT auto-advance
            - Only advances on explicit Continue/choice click
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import ThinkingSurface from "@/components/thinking/ThinkingSurface";
import ThinkingTurn from "@/components/thinking/ThinkingTurn";

type Shift = "faster" | "clearer" | "followthrough" | "surprises" | "other";

function cleanOneLine(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

export default function Step1() {
  // Turn 1
  const [t1Draft, setT1Draft] = useState<string>("");
  const [t1, setT1] = useState<string | null>(null);

  // Turn 2
  const [t2Draft, setT2Draft] = useState<string>("");
  const [t2, setT2] = useState<string | null>(null);

  // Turn 3 (choice)
  const [t3, setT3] = useState<Shift | null>(null);

  // Turn 4 (choice)
  const [t4, setT4] = useState<"tighten" | "adjust" | "right" | null>(null);

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

  function commitTurn1() {
    const v = cleanOneLine(t1Draft);
    if (!v) return;
    setT1(v);
  }

  function commitTurn2() {
    const v = cleanOneLine(t2Draft);
    if (!v) return;
    setT2(v);
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
        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={locked1 ? (t1 || "") : t1Draft}
            onChange={(e) => setT1Draft(e.target.value)}
            placeholder="e.g., Our customer service feels inconsistent."
            disabled={locked1}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitTurn1();
              }
            }}
            style={{
              height: 46,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.20)",
              color: "rgba(255,255,255,0.92)",
              padding: "0 14px",
              outline: "none",
            }}
          />

          {!locked1 ? (
            <button
              type="button"
              onClick={commitTurn1}
              disabled={!cleanOneLine(t1Draft)}
              style={{
                height: 46,
                borderRadius: 14,
                border: "1px solid rgba(255,121,0,0.35)",
                background:
                  "linear-gradient(180deg, rgba(255,121,0,0.92), rgba(240,78,35,0.78))",
                color: "#ffffff",
                fontWeight: 900,
                cursor: !cleanOneLine(t1Draft) ? "not-allowed" : "pointer",
                opacity: !cleanOneLine(t1Draft) ? 0.6 : 1,
              }}
            >
              Continue
            </button>
          ) : null}
        </div>
      </ThinkingTurn>

      {/* Turn 2 */}
      {locked1 ? (
        <ThinkingTurn
          systemLead="Turn 2"
          systemOutput={`Got it. You said: “${t1}”`}
          prompt="If this is better in 30 days, what would people notice first?"
          locked={locked2}
        >
          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={locked2 ? (t2 || "") : t2Draft}
              onChange={(e) => setT2Draft(e.target.value)}
              placeholder="e.g., Customers get answers within 1 business day."
              disabled={locked2}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitTurn2();
                }
              }}
              style={{
                height: 46,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.20)",
                color: "rgba(255,255,255,0.92)",
                padding: "0 14px",
                outline: "none",
              }}
            />

            {!locked2 ? (
              <button
                type="button"
                onClick={commitTurn2}
                disabled={!cleanOneLine(t2Draft)}
                style={{
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid rgba(255,121,0,0.35)",
                  background:
                    "linear-gradient(180deg, rgba(255,121,0,0.92), rgba(240,78,35,0.78))",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: !cleanOneLine(t2Draft) ? "not-allowed" : "pointer",
                  opacity: !cleanOneLine(t2Draft) ? 0.6 : 1,
                }}
              >
                Continue
              </button>
            ) : null}
          </div>
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
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["faster", "Faster response"],
              ["clearer", "Clearer communication"],
              ["followthrough", "Consistent follow-through"],
              ["surprises", "Fewer surprises"],
              ["other", "Something else"],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                disabled={locked3}
                onClick={() => setT3(v as Shift)}
                style={{
                  textAlign: "left",
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: t3 === v ? "rgba(255,121,0,0.12)" : "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.92)",
                  fontWeight: 800,
                  cursor: locked3 ? "not-allowed" : "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </ThinkingTurn>
      ) : null}

      {/* Turn 4 */}
      {locked3 ? (
        <ThinkingTurn
          systemLead="Turn 4"
          systemOutput="Here’s a first draft of what you’re really trying to solve:"
          prompt={draft || "(Draft will appear here.)"}
          locked={locked4}
        >
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["tighten", "Tighten wording"],
              ["adjust", "Adjust outcome"],
              ["right", "This is right"],
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                disabled={locked4}
                onClick={() => setT4(v as any)}
                style={{
                  textAlign: "left",
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: t4 === v ? "rgba(255,121,0,0.12)" : "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.92)",
                  fontWeight: 800,
                  cursor: locked4 ? "not-allowed" : "pointer",
                }}
              >
                {label}
              </button>
            ))}

            {locked4 ? (
              <div style={{ marginTop: 14, opacity: 0.78, fontSize: 13, lineHeight: 1.5 }}>
                Step 1 complete. Next, we’ll turn this into a SMART goal with milestones.
              </div>
            ) : null}
          </div>
        </ThinkingTurn>
      ) : null}
    </ThinkingSurface>
  );
}
