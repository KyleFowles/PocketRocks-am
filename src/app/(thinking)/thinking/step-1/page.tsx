/* ============================================================
   FILE: src/app/(thinking)/thinking/step-1/page.tsx
   PURPOSE: Guided Turns — Step 1 (self-contained + stable)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";

type ShiftOption =
  | "Faster response"
  | "Clearer communication"
  | "Consistent follow-through"
  | "Fewer surprises"
  | "Something else";

type Turn =
  | { id: "t1"; kind: "input"; prompt: string; value: string; locked: boolean; placeholder: string }
  | { id: "t2"; kind: "input"; prompt: string; value: string; locked: boolean; placeholder: string }
  | { id: "t3"; kind: "choice"; prompt: string; value: ShiftOption | ""; locked: boolean; options: ShiftOption[] }
  | { id: "t4"; kind: "confirm"; prompt: string; value: "Tighten wording" | "Adjust outcome" | "This is right" | ""; locked: boolean };

export default function ThinkingStep1Page() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: "t1",
      kind: "input",
      prompt: "In one sentence, what’s not working right now?",
      value: "",
      locked: false,
      placeholder: "Example: Our customers wait too long for replies.",
    },
  ]);

  const t1 = useMemo(() => turns.find((t) => t.id === "t1") as Turn | undefined, [turns]);
  const t2 = useMemo(() => turns.find((t) => t.id === "t2") as Turn | undefined, [turns]);
  const t3 = useMemo(() => turns.find((t) => t.id === "t3") as Turn | undefined, [turns]);
  const t4 = useMemo(() => turns.find((t) => t.id === "t4") as Turn | undefined, [turns]);

  const problem = (t1 && "value" in t1 ? t1.value.trim() : "") || "";
  const notice = (t2 && "value" in t2 ? t2.value.trim() : "") || "";
  const shift = (t3 && "value" in t3 ? (t3.value as string) : "") || "";

  const draftGoal = useMemo(() => {
    if (!problem && !notice && !shift) return "";

    const base = problem ? problem.replace(/\.$/, "") : "This issue";
    const outcome = notice ? notice.replace(/\.$/, "") : "people notice clear improvement";
    const lens = shift ? ` (${shift.toLowerCase()})` : "";

    return `Improve ${base} so that within 30 days ${outcome}${lens}.`;
  }, [problem, notice, shift]);

  function lockTurn(id: Turn["id"]) {
    setTurns((prev) =>
      prev.map((t) => (t.id === id ? ({ ...t, locked: true } as Turn) : t))
    );
  }

  function addTurn(next: Turn) {
    setTurns((prev) => [...prev, next]);
  }

  function updateTurnValue(id: Turn["id"], value: any) {
    setTurns((prev) => prev.map((t) => (t.id === id ? ({ ...t, value } as Turn) : t)));
  }

  function goNextFromT1() {
    const v = problem;
    if (!v) return;

    lockTurn("t1");

    addTurn({
      id: "t2",
      kind: "input",
      prompt: "If this is better in 30 days, what would people notice first?",
      value: "",
      locked: false,
      placeholder: "Example: Customers get an answer the same day.",
    });
  }

  function goNextFromT2() {
    const v = notice;
    if (!v) return;

    lockTurn("t2");

    addTurn({
      id: "t3",
      kind: "choice",
      prompt: "Pick the primary shift that matters most right now.",
      value: "",
      locked: false,
      options: ["Faster response", "Clearer communication", "Consistent follow-through", "Fewer surprises", "Something else"],
    });
  }

  function goNextFromT3() {
    if (!shift) return;

    lockTurn("t3");

    addTurn({
      id: "t4",
      kind: "confirm",
      prompt: "Here’s a draft goal. What do you want to do next?",
      value: "",
      locked: false,
    });
  }

  function finalize(choice: "Tighten wording" | "Adjust outcome" | "This is right") {
    updateTurnValue("t4", choice);
    lockTurn("t4");
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <h1 style={styles.h1}>Step 1 — Turn a vague concern into a clear problem</h1>
        <p style={styles.p}>
          Keep it short. One turn at a time. Each step locks when you continue.
        </p>
      </div>

      <div style={styles.turnStack}>
        {/* Turn 1 */}
        {t1 && t1.kind === "input" && (
          <ThinkingTurn
            index={1}
            locked={t1.locked}
            prompt={t1.prompt}
            helper={t1.locked ? "Locked" : "One sentence is enough."}
            footer={
              <div style={styles.footerRow}>
                {!t1.locked ? (
                  <button
                    style={primaryBtn(!problem)}
                    onClick={goNextFromT1}
                    disabled={!problem}
                  >
                    Continue
                  </button>
                ) : (
                  <span style={styles.lockedPill}>Completed</span>
                )}
              </div>
            }
          >
            <input
              style={inputStyle(t1.locked)}
              value={t1.value}
              onChange={(e) => updateTurnValue("t1", e.target.value)}
              placeholder={t1.placeholder}
              disabled={t1.locked}
              maxLength={220}
            />
          </ThinkingTurn>
        )}

        {/* Turn 2 */}
        {t2 && t2.kind === "input" && (
          <ThinkingTurn
            index={2}
            locked={t2.locked}
            prompt={t2.prompt}
            helper={t2.locked ? "Locked" : "Start with what others would see or hear."}
            footer={
              <div style={styles.footerRow}>
                {!t2.locked ? (
                  <button
                    style={primaryBtn(!notice)}
                    onClick={goNextFromT2}
                    disabled={!notice}
                  >
                    Continue
                  </button>
                ) : (
                  <span style={styles.lockedPill}>Completed</span>
                )}
              </div>
            }
          >
            <input
              style={inputStyle(t2.locked)}
              value={t2.value}
              onChange={(e) => updateTurnValue("t2", e.target.value)}
              placeholder={t2.placeholder}
              disabled={t2.locked}
              maxLength={220}
            />
          </ThinkingTurn>
        )}

        {/* Turn 3 */}
        {t3 && t3.kind === "choice" && (
          <ThinkingTurn
            index={3}
            locked={t3.locked}
            prompt={t3.prompt}
            helper={t3.locked ? "Locked" : "Choose the closest match. You can refine later."}
            footer={
              <div style={styles.footerRow}>
                {!t3.locked ? (
                  <button
                    style={primaryBtn(!shift)}
                    onClick={goNextFromT3}
                    disabled={!shift}
                  >
                    Continue
                  </button>
                ) : (
                  <span style={styles.lockedPill}>Completed</span>
                )}
              </div>
            }
          >
            <div style={styles.choiceGrid}>
              {t3.options.map((opt) => {
                const active = t3.value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateTurnValue("t3", opt)}
                    disabled={t3.locked}
                    style={choiceBtn(active, t3.locked)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </ThinkingTurn>
        )}

        {/* Turn 4 */}
        {t4 && t4.kind === "confirm" && (
          <ThinkingTurn
            index={4}
            locked={t4.locked}
            prompt={t4.prompt}
            helper={t4.locked ? "Locked" : "This is a draft. You’re in control."}
            footer={
              <div style={styles.footerRow}>
                {!t4.locked ? (
                  <div style={styles.confirmRow}>
                    <button style={secondaryBtn} onClick={() => finalize("Tighten wording")}>
                      Tighten wording
                    </button>
                    <button style={secondaryBtn} onClick={() => finalize("Adjust outcome")}>
                      Adjust outcome
                    </button>
                    <button style={primaryBtn(false)} onClick={() => finalize("This is right")}>
                      This is right
                    </button>
                  </div>
                ) : (
                  <span style={styles.lockedPill}>Completed</span>
                )}
              </div>
            }
          >
            <div style={styles.draftBox}>
              <div style={styles.draftLabel}>Draft goal</div>
              <div style={styles.draftText}>{draftGoal || "—"}</div>
            </div>
          </ThinkingTurn>
        )}
      </div>
    </div>
  );
}

function ThinkingTurn(props: {
  index: number;
  locked: boolean;
  prompt: string;
  helper?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { index, locked, prompt, helper, children, footer } = props;

  return (
    <section style={turnCard(locked)}>
      <div style={styles.turnTop}>
        <div style={styles.turnIndex}>{index}</div>
        <div style={styles.turnText}>
          <div style={styles.turnPrompt}>{prompt}</div>
          {helper ? <div style={styles.turnHelper}>{helper}</div> : null}
        </div>
      </div>

      <div style={styles.turnBody}>{children}</div>

      {footer ? <div style={styles.turnFooter}>{footer}</div> : null}
    </section>
  );
}

/* ---------------- Styles (no Tailwind required) ---------------- */

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  top: {
    padding: "6px 4px 4px",
  },
  h1: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.1,
  },
  p: {
    margin: "6px 0 0",
    fontSize: 13,
    opacity: 0.85,
    lineHeight: 1.35,
  },
  turnStack: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  turnTop: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  turnIndex: {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,121,0,0.14)",
    border: "1px solid rgba(255,121,0,0.25)",
    color: "#FF7900",
    fontWeight: 800,
    flex: "0 0 auto",
    marginTop: 1,
  },
  turnText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  turnPrompt: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.25,
  },
  turnHelper: {
    fontSize: 12,
    opacity: 0.75,
    lineHeight: 1.25,
  },
  turnBody: {
    marginTop: 10,
  },
  turnFooter: {
    marginTop: 12,
    display: "flex",
    justifyContent: "flex-end",
  },
  footerRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  lockedPill: {
    fontSize: 12,
    opacity: 0.7,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(229,232,235,0.14)",
    background: "rgba(229,232,235,0.06)",
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },
  confirmRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
  },
  draftBox: {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(229,232,235,0.12)",
    background: "rgba(10,16,24,0.55)",
  },
  draftLabel: {
    fontSize: 12,
    opacity: 0.75,
    marginBottom: 6,
  },
  draftText: {
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.35,
  },
};

function turnCard(locked: boolean): React.CSSProperties {
  return {
    borderRadius: 18,
    border: "1px solid rgba(229,232,235,0.10)",
    background: locked ? "rgba(20,34,51,0.28)" : "rgba(20,34,51,0.40)",
    padding: 14,
    boxShadow: "0 14px 44px rgba(0,0,0,0.30)",
    opacity: locked ? 0.82 : 1,
  };
}

function inputStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(229,232,235,0.14)",
    background: disabled ? "rgba(229,232,235,0.06)" : "rgba(10,16,24,0.55)",
    color: "rgba(229,232,235,0.96)",
    outline: "none",
    fontSize: 14,
    lineHeight: 1.3,
  };
}

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,121,0,0.38)",
    background: disabled ? "rgba(255,121,0,0.10)" : "#FF7900",
    color: "#FFFFFF",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    boxShadow: disabled ? "none" : "0 10px 26px rgba(255,121,0,0.22)",
  };
}

const secondaryBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(229,232,235,0.16)",
  background: "rgba(229,232,235,0.06)",
  color: "rgba(229,232,235,0.95)",
  fontWeight: 750,
  cursor: "pointer",
};

function choiceBtn(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "12px 12px",
    borderRadius: 14,
    border: active ? "1px solid rgba(255,121,0,0.55)" : "1px solid rgba(229,232,235,0.14)",
    background: active ? "rgba(255,121,0,0.12)" : "rgba(10,16,24,0.45)",
    color: active ? "rgba(255,121,0,0.98)" : "rgba(229,232,235,0.94)",
    fontWeight: 750,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.8 : 1,
  };
}
