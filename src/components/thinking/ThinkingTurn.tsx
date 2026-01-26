/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE:
   - World-class PocketRocks Thinking Turn
   - Quiet input + iPhone sticky CTA + subtle reveal animation
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useState } from "react";

export default function ThinkingTurn({
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
      className={locked ? "" : "pr-turn--animate"}
      style={{
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.10)",
        background: locked
          ? "rgba(255,255,255,0.035)"
          : "rgba(255,255,255,0.05)",
        boxShadow: locked ? "none" : "0 18px 55px rgba(0,0,0,0.35)",
        transition: "opacity 180ms ease",
        opacity: locked ? 0.62 : 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {systemLead}
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 850,
            padding: "6px 10px",
            borderRadius: 999,
            border: locked
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,121,0,0.22)",
            background: locked ? "rgba(0,0,0,0.20)" : "rgba(255,121,0,0.10)",
            opacity: 0.85,
          }}
        >
          {locked ? "Locked" : "Active"}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div
          style={{
            fontSize: 18,
            lineHeight: 1.25,
            fontWeight: 950,
            letterSpacing: "-0.01em",
            color: "rgba(246,247,251,0.98)",
          }}
        >
          {prompt}
        </div>

        {systemOutput ? (
          <div
            style={{
              marginTop: 10,
              padding: "12px 12px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.18)",
              fontSize: 14,
              lineHeight: 1.45,
              opacity: 0.9,
            }}
          >
            {systemOutput}
          </div>
        ) : null}

        <div style={{ marginTop: 14 }}>{children}</div>
      </div>
    </section>
  );
}

export function TurnInput({
  value,
  onSubmit,
  locked,
  placeholder,
  ctaLabel = "Continue",
}: {
  value: string;
  onSubmit: (val: string) => void;
  locked: boolean;
  placeholder: string;
  ctaLabel?: string;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const canSubmit = useMemo(() => local.trim().length >= 2, [local]);

  function submit() {
    if (locked) return;
    const v = local.trim();
    if (v.length < 2) return;
    onSubmit(v);
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input
        value={local}
        disabled={locked}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="pr-input-dark"
      />

      {/* Desktop: inline right. iPhone: fixed bottom bar (via CSS). */}
      <div className="pr-mobile-cta">
        <button
          type="button"
          disabled={locked || !canSubmit}
          onClick={submit}
          className="pr-primary"
          style={{
            width: "auto",
            padding: "12px 18px",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 950,
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

export function TurnChoice({
  options,
  onPick,
  locked,
}: {
  options: string[];
  onPick: (val: string) => void;
  locked: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {options.map((opt) => (
        <button
          key={opt}
          disabled={locked}
          onClick={() => onPick(opt)}
          className="pr-secondary"
          style={{
            textAlign: "left",
            padding: "14px 14px",
            borderRadius: 16,
            fontWeight: 850,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
