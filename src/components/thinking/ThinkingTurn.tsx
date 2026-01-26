/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE: One turn = one prompt + one user action + lock state
            Speed layer:
            - ThinkingTurn (base wrapper, backwards compatible)
            - TurnInput (1-line input + Continue)
            - TurnChoice (choice list)
   ============================================================ */

"use client";

import React, { useMemo, useState } from "react";

export function ThinkingTurn({
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
      className={[
        "rounded-xl border border-neutral-900 p-5 transition",
        locked ? "opacity-75 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      <p className="text-sm text-neutral-300">{systemLead}</p>

      {systemOutput ? (
        <div className="mt-3 rounded-lg border border-neutral-900 bg-neutral-950/60 p-3 text-sm text-neutral-200">
          {systemOutput}
        </div>
      ) : null}

      <p className="mt-4 text-sm font-medium text-neutral-100">{prompt}</p>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function cleanOneLine(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

export function TurnInput({
  systemLead,
  systemOutput,
  prompt,
  locked,
  value,
  placeholder,
  ctaLabel = "Continue",
  onSubmit,
}: {
  systemLead: string;
  systemOutput?: string;
  prompt: string;
  locked: boolean;
  value: string;
  placeholder?: string;
  ctaLabel?: string;
  onSubmit: (finalValue: string) => void;
}) {
  const [draft, setDraft] = useState(value || "");

  // Keep draft in sync when parent sets value (e.g., restore)
  React.useEffect(() => {
    if (!locked) setDraft(value || "");
  }, [value, locked]);

  const canSubmit = useMemo(() => Boolean(cleanOneLine(draft)), [draft]);

  return (
    <ThinkingTurn systemLead={systemLead} systemOutput={systemOutput} prompt={prompt} locked={locked}>
      <div style={{ display: "grid", gap: 10 }}>
        <input
          value={locked ? value : draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          disabled={locked}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = cleanOneLine(draft);
              if (v) onSubmit(v);
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
        {!locked ? (
          <button
            type="button"
            onClick={() => {
              const v = cleanOneLine(draft);
              if (v) onSubmit(v);
            }}
            disabled={!canSubmit}
            style={{
              height: 46,
              borderRadius: 14,
              border: "1px solid rgba(255,121,0,0.35)",
              background: "linear-gradient(180deg, rgba(255,121,0,0.92), rgba(240,78,35,0.78))",
              color: "#ffffff",
              fontWeight: 900,
              cursor: !canSubmit ? "not-allowed" : "pointer",
              opacity: !canSubmit ? 0.6 : 1,
            }}
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </ThinkingTurn>
  );
}

export function TurnChoice<T extends string>({
  systemLead,
  systemOutput,
  prompt,
  locked,
  value,
  choices,
  onChoose,
}: {
  systemLead: string;
  systemOutput?: string;
  prompt: string;
  locked: boolean;
  value: T | null;
  choices: Array<{ value: T; label: string }>;
  onChoose: (v: T) => void;
}) {
  return (
    <ThinkingTurn systemLead={systemLead} systemOutput={systemOutput} prompt={prompt} locked={locked}>
      <div style={{ display: "grid", gap: 10 }}>
        {choices.map((c) => (
          <button
            key={c.value}
            type="button"
            disabled={locked}
            onClick={() => onChoose(c.value)}
            style={{
              textAlign: "left",
              padding: "12px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: value === c.value ? "rgba(255,121,0,0.12)" : "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.92)",
              fontWeight: 800,
              cursor: locked ? "not-allowed" : "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </ThinkingTurn>
  );
}

// Default export alias (for convenience)
export default ThinkingTurn;
