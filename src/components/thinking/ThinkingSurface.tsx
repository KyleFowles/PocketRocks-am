/* ============================================================
   FILE: src/components/thinking/ThinkingSurface.tsx

   PocketRocks — Thinking Surface (Step 1 + Step 2)

   Step 1 (Clarify): Orientation → Reflection → Pattern → Draft goal
   Step 2 (SMART): Bridge → S → M → A → R → T → Summary → Milestones

   Design rules:
   - Turn-based, vertical stack
   - One action per turn
   - Completed turns lock + dim
   - Calm, executive flow

   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";
import ThinkingTurn from "./ThinkingTurn";

type TurnKind = "write" | "choice" | "confirm" | "info";

type Turn = {
  id: string;
  kind: TurnKind;
  title?: string;
  prompt: string;

  // State
  answer?: string;

  // Input helpers
  placeholder?: string;
  multiline?: boolean;
  defaultValue?: string;

  // Button helpers
  actionLabel?: string;
  allowBlankAccept?: boolean;

  // Choice helpers
  options?: string[];
};

export default function ThinkingSurface() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: "1",
      kind: "write",
      title: "Step 1 — Orientation",
      prompt: "In one sentence: what’s not working right now?",
      placeholder: "Type one clear sentence…",
      multiline: false,
      actionLabel: "Continue",
    },
  ]);

  function hasTurn(list: Turn[], id: string) {
    return list.some((t) => t.id === id);
  }

  function getAnswer(list: Turn[], id: string) {
    return (list.find((t) => t.id === id)?.answer ?? "").trim();
  }

  function buildDraftGoal(shiftChoice: string) {
    const c = (shiftChoice || "").toLowerCase();

    if (c.includes("response")) {
      return "Draft goal: Improve response speed and follow-through over the next 30 days.";
    }
    if (c.includes("communication")) {
      return "Draft goal: Create clearer communication and expectations over the next 30 days.";
    }
    if (c.includes("surprises")) {
      return "Draft goal: Reduce surprises by improving consistency and visibility over the next 30 days.";
    }
    if (c.includes("follow")) {
      return "Draft goal: Improve consistent follow-through over the next 30 days.";
    }
    return "Draft goal: Make meaningful progress on this issue over the next 30 days.";
  }

  function buildSmartStatement(list: Turn[]) {
    const issue = getAnswer(list, "1");
    const notice = getAnswer(list, "2");
    const shift = getAnswer(list, "3");

    const specific = getAnswer(list, "6");
    const measurable = getAnswer(list, "7");
    const achievable = getAnswer(list, "8");
    const relevant = getAnswer(list, "9");
    const timebound = getAnswer(list, "10");

    // Simple, clean v1 statement. Deterministic.
    const parts: string[] = [];

    if (specific) parts.push(specific);
    else if (issue) parts.push(`Improve: ${issue}`);

    if (measurable) parts.push(`Measured by: ${measurable}`);
    else if (notice) parts.push(`Measured by: ${notice}`);

    if (achievable) parts.push(`Approach: ${achievable}`);

    if (relevant) parts.push(`Why now: ${relevant}`);
    else if (shift) parts.push(`Focus: ${shift}`);

    if (timebound) parts.push(`By: ${timebound}`);
    else parts.push("By: within 30 days");

    return parts.join(" | ");
  }

  function buildMilestones(list: Turn[]) {
    // Deterministic v1 milestones: 5 steps that fit most SMART Rocks
    const timebound = getAnswer(list, "10") || "the deadline";
    const measurable = getAnswer(list, "7");
    const specific = getAnswer(list, "6") || getAnswer(list, "1") || "the goal";

    const lines: string[] = [
      "Milestones (v1):",
      `1) Define “done” for: ${specific}`,
      measurable ? `2) Choose the metric and baseline: ${measurable}` : "2) Choose the metric and baseline",
      "3) Set weekly check-in cadence (10 minutes)",
      "4) Execute the top 2 actions that move the metric",
      `5) Confirm results and lock the new standard by: ${timebound}`,
    ];

    return lines.join("\n");
  }

  function appendNextTurns(updated: Turn[], completedId: string, completedValue: string) {
    // Step 1 — Clarify
    if (completedId === "1" && !hasTurn(updated, "2")) {
      updated.push({
        id: "2",
        kind: "write",
        title: "Step 1 — Reflection",
        prompt: "If this were better in 30 days, what would people notice first?",
        placeholder: "What would they notice first…",
        multiline: false,
        actionLabel: "Continue",
      });
    }

    if (completedId === "2" && !hasTurn(updated, "3")) {
      updated.push({
        id: "3",
        kind: "choice",
        title: "Step 1 — Pattern recognition",
        prompt: "What kind of shift matters most here?",
        options: [
          "Faster response",
          "Clearer communication",
          "More consistent follow-through",
          "Fewer surprises",
          "Something else",
        ],
      });
    }

    if (completedId === "3" && !hasTurn(updated, "4")) {
      updated.push({
        id: "4",
        kind: "confirm",
        title: "Step 1 — Co-draft",
        prompt: buildDraftGoal(completedValue),
        actionLabel: "This is right",
      });
    }

    // Step 2 — SMART (Option B bridge)
    if (completedId === "4" && !hasTurn(updated, "5")) {
      updated.push({
        id: "5",
        kind: "info",
        title: "Step 2 — SMART",
        prompt: "Good. Now let’s make this a SMART Rock — clear and measurable.",
        actionLabel: "Continue to SMART",
      });
    }

    if (completedId === "5" && !hasTurn(updated, "6")) {
      updated.push({
        id: "6",
        kind: "write",
        title: "SMART — Specific",
        prompt: "What exactly will improve? Name the outcome in plain words.",
        placeholder: "Example: Reduce average response time to customers…",
        multiline: true,
        actionLabel: "Continue",
      });
    }

    if (completedId === "6" && !hasTurn(updated, "7")) {
      updated.push({
        id: "7",
        kind: "write",
        title: "SMART — Measurable",
        prompt: "How will you measure it? Name one metric and a target.",
        placeholder: "Example: From 24 hours → under 4 hours for first response…",
        multiline: true,
        actionLabel: "Continue",
      });
    }

    if (completedId === "7" && !hasTurn(updated, "8")) {
      updated.push({
        id: "8",
        kind: "write",
        title: "SMART — Achievable",
        prompt: "What makes this achievable? Name the main approach or constraint.",
        placeholder: "Example: Add a daily triage block and a simple escalation rule…",
        multiline: true,
        actionLabel: "Continue",
      });
    }

    if (completedId === "8" && !hasTurn(updated, "9")) {
      updated.push({
        id: "9",
        kind: "write",
        title: "SMART — Relevant",
        prompt: "Why does this matter right now? Link it to the bigger win (customers, team, profit, capacity).",
        placeholder: "Example: Supports our Customer First initiative…",
        multiline: true,
        actionLabel: "Continue",
      });
    }

    if (completedId === "9" && !hasTurn(updated, "10")) {
      updated.push({
        id: "10",
        kind: "write",
        title: "SMART — Time-bound",
        prompt: "By when, and what’s the checkpoint rhythm? Name the deadline and one review cadence.",
        placeholder: "Example: By Jan 31, reviewed weekly…",
        multiline: false,
        actionLabel: "Continue",
      });
    }

    if (completedId === "10" && !hasTurn(updated, "11")) {
      const suggested = buildSmartStatement(updated);
      updated.push({
        id: "11",
        kind: "write",
        title: "SMART Summary",
        prompt: "Here is your SMART snapshot. Accept it, or tighten the wording.",
        defaultValue: suggested,
        placeholder: "Leave as-is, or tighten the wording…",
        multiline: true,
        actionLabel: "This is right",
        allowBlankAccept: true,
      });
    }

    if (completedId === "11" && !hasTurn(updated, "12")) {
      const milestones = buildMilestones(updated);
      updated.push({
        id: "12",
        kind: "confirm",
        title: "Milestones",
        prompt: milestones,
        actionLabel: "Finish",
      });
    }
  }

  function completeTurn(id: string, value: string) {
    setTurns((prev) => {
      const safePrev = (prev || []).filter(Boolean) as Turn[];

      // Update answer for completed turn
      const updated: Turn[] = safePrev.map((t) =>
        t.id === id ? { ...t, answer: value } : t
      );

      // Append next turns deterministically
      appendNextTurns(updated, id, value);

      return updated;
    });
  }

  const safeTurns = useMemo(() => (turns.filter(Boolean) as Turn[]), [turns]);

  const firstOpenId = useMemo(() => {
    const open = safeTurns.find((t) => !t.answer);
    return open?.id ?? safeTurns[0]?.id ?? "1";
  }, [safeTurns]);

  return (
    <section
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "48px 18px 80px",
        pointerEvents: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            PocketRocks
          </h1>
          <p style={{ opacity: 0.75, margin: 0 }}>
            A calm thinking surface. One step at a time.
          </p>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(20,34,51,0.55)",
            opacity: 0.95,
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          Step 1–2 · Clarify + SMART
        </div>
      </div>

      {/* Main thinking card */}
      <div
        style={{
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(20,34,51,0.35)",
          boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
          overflow: "hidden",
          pointerEvents: "auto",
        }}
      >
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {safeTurns.map((turn) => (
              <ThinkingTurn
                key={turn.id}
                turn={turn}
                autoFocus={turn.id === firstOpenId}
                onComplete={(val) => completeTurn(turn.id, val)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 18px",
            opacity: 0.78,
            fontSize: 14,
          }}
        >
          Keep each answer short. PocketRocks works best in clean lines.
        </div>
      </div>
    </section>
  );
}
