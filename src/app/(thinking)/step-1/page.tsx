/* ============================================================
   FILE: src/app/(thinking)/step-1/page.tsx
   PURPOSE: Step 1 — Guided Turns (multi-user, Firestore persistence)
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { listenToAuth } from "@/lib/auth";
import type { User } from "firebase/auth";
import { ThinkingSurface } from "@/components/thinking/ThinkingSurface";
import { ThinkingTurn } from "@/components/thinking/ThinkingTurn";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { Turn } from "@/lib/types";
import {
  draftGoalFromInputs,
  firstIncompleteIndex,
  initialStep1Turns,
  safeRestate,
} from "@/lib/step1Machine";
import {
  createStep1Session,
  loadLatestStep1SessionId,
  loadSession,
  updateSessionTurns,
} from "@/lib/firestore";

const CHOICES = [
  "Faster response time",
  "Clearer communication",
  "More consistent follow-through",
  "Fewer surprises",
  "Something else",
] as const;

export default function Step1Page() {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>(() => initialStep1Turns());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local inputs per turn (only for active turn)
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");

  useEffect(() => {
    const unsub = listenToAuth((u) => setUser(u));
    return () => unsub();
  }, []);

  // Load (or create) latest session for this user
  useEffect(() => {
    async function boot() {
      if (!user) return;
      setLoading(true);

      const latestId = await loadLatestStep1SessionId(user.uid);

      if (!latestId) {
        const freshTurns = initialStep1Turns();
        const newId = await createStep1Session(user.uid, freshTurns);
        setSessionId(newId);
        setTurns(freshTurns);
        setLoading(false);
        return;
      }

      const doc = await loadSession(latestId);
      if (!doc) {
        // fallback: create new if doc missing
        const freshTurns = initialStep1Turns();
        const newId = await createStep1Session(user.uid, freshTurns);
        setSessionId(newId);
        setTurns(freshTurns);
        setLoading(false);
        return;
      }

      setSessionId(latestId);
      setTurns(doc.turns ?? initialStep1Turns());

      // Hydrate local inputs for convenience (if already completed)
      const tt1 = (doc.turns ?? []).find((t) => t.id === "t1")?.userInput ?? "";
      const tt2 = (doc.turns ?? []).find((t) => t.id === "t2")?.userInput ?? "";
      setT1(tt1);
      setT2(tt2);

      setLoading(false);
    }

    boot().catch(() => setLoading(false));
  }, [user]);

  const activeIndex = useMemo(() => {
    const idx = firstIncompleteIndex(turns);
    return idx === -1 ? turns.length : idx;
  }, [turns]);

  async function persist(nextTurns: Turn[]) {
    if (!sessionId) return;
    setSaving(true);
    try {
      await updateSessionTurns(sessionId, nextTurns);
    } finally {
      setSaving(false);
    }
  }

  function lockTurn(id: Turn["id"], patch: Partial<Turn>) {
    const next = turns.map((t) =>
      t.id === id ? { ...t, ...patch, completedAt: Date.now() } : t
    );
    setTurns(next);
    void persist(next);
  }

  function isLocked(i: number) {
    return i < activeIndex;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Loading your thinking trail…
      </main>
    );
  }

  return (
    <ThinkingSurface
      title="Step 1 — Get clear on what’s really happening"
      subtitle="One turn at a time. We’ll keep it calm and concrete."
      rightSlot={
        <div className="text-xs text-neutral-500">
          {saving ? "Saving…" : sessionId ? "Saved" : ""}
        </div>
      }
    >
      {/* TURN 1 */}
      <ThinkingTurn
        systemLead={turns[0].systemLead}
        prompt={turns[0].prompt}
        locked={isLocked(0)}
      >
        <div className="space-y-3">
          <TextField
            value={t1}
            onChange={setT1}
            placeholder="Customer service feels inconsistent and slow…"
            autoFocus={!isLocked(0)}
            disabled={isLocked(0)}
          />
          {!isLocked(0) ? (
            <Button
              onClick={() => {
                const rest = safeRestate(t1);
                lockTurn("t1", { userInput: t1.trim() || rest });
              }}
              disabled={!t1.trim()}
              className="w-full"
            >
              Continue
            </Button>
          ) : (
            <div className="text-sm text-neutral-400">{turns[0].userInput}</div>
          )}
        </div>
      </ThinkingTurn>

      {/* TURN 2 */}
      <ThinkingTurn
        systemLead={turns[1].systemLead}
        systemOutput={
          turns[0].completedAt
            ? safeRestate(turns[0].userInput || "")
            : undefined
        }
        prompt={turns[1].prompt}
        locked={isLocked(1)}
      >
        <div className="space-y-3">
          <TextField
            value={t2}
            onChange={setT2}
            placeholder="They’d hear back the same day and know what happens next…"
            disabled={isLocked(1) || !turns[0].completedAt}
          />
          {!isLocked(1) ? (
            <Button
              onClick={() => lockTurn("t2", { userInput: t2.trim() })}
              disabled={!turns[0].completedAt || !t2.trim()}
              className="w-full"
            >
              Continue
            </Button>
          ) : (
            <div className="text-sm text-neutral-400">{turns[1].userInput}</div>
          )}
        </div>
      </ThinkingTurn>

      {/* TURN 3 */}
      <ThinkingTurn
        systemLead={turns[2].systemLead}
        prompt={turns[2].prompt}
        locked={isLocked(2)}
      >
        <div className="grid gap-2">
          {CHOICES.map((c) => {
            const selected = turns[2].userInput === c;
            return (
              <button
                key={c}
                type="button"
                disabled={isLocked(2) || !turns[1].completedAt}
                onClick={() => lockTurn("t3", { userInput: c })}
                className={[
                  "rounded-md border px-3 py-2 text-left text-sm transition",
                  selected
                    ? "border-neutral-500 bg-neutral-900 text-white"
                    : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:border-neutral-600",
                  isLocked(2) ? "opacity-80" : "",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>
        {!turns[1].completedAt ? (
          <p className="mt-3 text-xs text-neutral-500">
            Complete the prior turn to unlock this choice.
          </p>
        ) : null}
      </ThinkingTurn>

      {/* TURN 4 */}
      <ThinkingTurn
        systemLead={turns[3].systemLead}
        systemOutput={
          turns[2].completedAt
            ? draftGoalFromInputs(
                turns[0].userInput || "",
                turns[1].userInput || "",
                turns[2].userInput || "Something else"
              )
            : undefined
        }
        prompt={turns[3].prompt}
        locked={isLocked(3)}
      >
        <div className="grid gap-2">
          <Button
            variant="secondary"
            disabled={!turns[2].completedAt || isLocked(3)}
            onClick={() =>
              lockTurn("t4", {
                userInput: "Tighten wording",
                systemOutput: "User chose to tighten wording.",
              })
            }
          >
            Tighten wording
          </Button>

          <Button
            variant="secondary"
            disabled={!turns[2].completedAt || isLocked(3)}
            onClick={() =>
              lockTurn("t4", {
                userInput: "Adjust outcome",
                systemOutput: "User chose to adjust outcome.",
              })
            }
          >
            Adjust the outcome
          </Button>

          <Button
            disabled={!turns[2].completedAt || isLocked(3)}
            onClick={() =>
              lockTurn("t4", {
                userInput: "This is right",
                systemOutput: "Good. We’re aligned on the problem.",
              })
            }
          >
            This is right
          </Button>

          {turns[3].completedAt ? (
            <div className="mt-3 rounded-lg border border-neutral-900 bg-neutral-950/60 p-3 text-sm text-neutral-200">
              {turns[3].systemOutput || "Good. We’re aligned on the problem."}
              <div className="mt-3">
                <Button variant="secondary" onClick={() => alert("Step 2 comes next.")}>
                  Continue to specifics
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </ThinkingTurn>
    </ThinkingSurface>
  );
}
