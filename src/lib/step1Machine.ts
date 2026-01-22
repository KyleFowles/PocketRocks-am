/* ============================================================
   FILE: src/lib/step1Machine.ts
   PURPOSE: Step 1 canonical flow (Guided Turns)
   ============================================================ */

import type { Turn } from "./types";

export function initialStep1Turns(): Turn[] {
  return [
    {
      id: "t1",
      type: "orientation",
      systemLead: "Let’s start by grounding the issue.",
      prompt: "In one sentence, what’s not working right now?",
    },
    {
      id: "t2",
      type: "reflection",
      systemLead: "Here’s how I’m hearing that:",
      prompt: "If this were working better in 30 days, what would people notice first?",
    },
    {
      id: "t3",
      type: "choice",
      systemLead: "Most situations like this come down to one primary shift.",
      prompt: "Which feels closest to the real win?",
    },
    {
      id: "t4",
      type: "codraft",
      systemLead: "Let me try a first draft. We’ll shape it together.",
      prompt: "What should we do with this?",
    },
  ];
}

export function isTurnComplete(t: Turn): boolean {
  return !!t.completedAt;
}

export function firstIncompleteIndex(turns: Turn[]): number {
  return turns.findIndex((t) => !isTurnComplete(t));
}

export function safeRestate(userText: string): string {
  const s = userText.trim();
  if (!s) return "You’re noticing something isn’t working the way it should.";
  // Keep it neutral and short. No judgment, no “should”.
  if (s.length <= 110) return s.replace(/\s+/g, " ");
  return s.replace(/\s+/g, " ").slice(0, 110).trim() + "…";
}

export function draftGoalFromInputs(t1: string, t2: string, t3Choice: string): string {
  const a = t1.trim();
  const b = t2.trim();

  // A calm, provisional draft. We can improve later, but this is good enough for Step 1.
  const outcome =
    t3Choice === "Faster response time"
      ? "responding within one business day, consistently"
      : t3Choice === "Clearer communication"
      ? "using clear updates and next steps"
      : t3Choice === "More consistent follow-through"
      ? "following through reliably and on time"
      : t3Choice === "Fewer surprises"
      ? "setting expectations early and reducing surprises"
      : "clarifying the core improvement and making it consistent";

  // If user gave a “notice first” statement, use it to anchor the draft.
  const notice = b ? b : "people can clearly see what changed";

  // Keep it readable.
  return `Improve customer experience so ${notice.toLowerCase()} by ${outcome}.`;
}
