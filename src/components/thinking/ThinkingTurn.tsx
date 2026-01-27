/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE:
   - PocketRocks Thinking Turn (compact, above-the-fold)
   - Uses globals.css classes (pr-turn / pr-turn-inner / pr-btn / pr-input)
   - Keeps interactivity hardened (z-index + pointerEvents)
   - Forces focus into the active input so typing always works.
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  const cls = [
    "pr-turn",
    locked ? "pr-turn-done" : "",
    locked ? "" : "pr-turn--animate",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={cls}
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Header bar (compact) */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background: "rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            fontSize: 11,
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
            fontSize: 11,
            fontWeight: 850,
            padding: "5px 9px",
            borderRadius: 999,
            border: locked
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,121,0,0.22)",
            background: locked ? "rgba(0,0,0,0.18)" : "rgba(255,121,0,0.10)",
            opacity: 0.88,
            whiteSpace: "nowrap",
          }}
        >
          {locked ? "Locked" : "Active"}
        </div>
      </div>

      {/* Body */}
      <div className="pr-turn-inner" style={{ position: "relative", zIndex: 2, pointerEvents: "auto" }}>
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.18,
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
              marginTop: 8,
              padding: "10px 10px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.16)",
              fontSize: 13.5,
              lineHeight: 1.4,
              opacity: 0.92,
            }}
          >
            {systemOutput}
          </div>
        ) : null}

        <div style={{ marginTop: 10, position: "relative", zIndex: 3 }}>
          {children}
        </div>
      </div>
    </section>
  );
}

export function TurnInput({
  value,
  onSubmit,
  locked,
  placeholder,
  ctaLabel = "Next: Make it SMART",
  hideCta = false,
}: {
  value: string;
  onSubmit: (val: string) => void;
  locked: boolean;
  placeholder: string;
  ctaLabel?: string;
  hideCta?: boolean;
}) {
  const [local, setLocal] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setLocal(value), [value]);

  // Force focus when this input is active.
  useEffect(() => {
    if (locked) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(t);
  }, [locked]);

  const canSubmit = useMemo(() => local.trim().length >= 2, [local]);

  function submit() {
    if (locked) return;
    const v = local.trim();
    if (v.length < 2) return;
    onSubmit(v);
  }

  return (
    <div style={{ display: "grid", gap: 8, position: "relative", zIndex: 5 }}>
      <input
        ref={inputRef}
        value={local}
        disabled={locked}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="pr-input"
        style={{
          position: "relative",
          zIndex: 10,
          pointerEvents: "auto",
        }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {hideCta ? null : (
        <div className="pr-mobile-cta" style={{ position: "relative", zIndex: 10 }}>
          <button
            type="button"
            disabled={locked || !canSubmit}
            onClick={submit}
            className="pr-btn pr-btn-primary"
            style={{
              width: "auto",
              padding: "0 14px",
              height: 40,
              borderRadius: 14,
              fontSize: 14.5,
              fontWeight: 900,
              pointerEvents: "auto",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      )}
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
    <div style={{ display: "grid", gap: 8, position: "relative", zIndex: 5 }}>
      {options.map((opt) => (
        <button
          key={opt}
          disabled={locked}
          onClick={() => onPick(opt)}
          className="pr-btn pr-btn-secondary"
          style={{
            justifyContent: "flex-start",
            textAlign: "left",
            padding: "0 12px",
            height: 40,
            borderRadius: 14,
            fontWeight: 850,
            pointerEvents: "auto",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
