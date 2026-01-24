/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx

   PocketRocks — Thinking Turn Component

   Fixes:
   - Word wrap for ALL data entry (textarea)
   - Auto-grow textarea (starts at 1 line)
   - Word wrap for long text (prompts + answers + buttons)
   - Crash-proof against undefined turn during dev hot reload
   - Auto-focus support for the first open turn
   - Supports info/bridge turns and prefilled default values
   - Build-safe TypeScript narrowing (no "turn possibly undefined")

   ============================================================ */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TurnKind = "write" | "choice" | "confirm" | "info";

type Turn = {
  id: string;
  kind: TurnKind;
  title?: string;
  prompt: string;
  answer?: string;

  placeholder?: string;
  multiline?: boolean;
  defaultValue?: string;

  actionLabel?: string;
  allowBlankAccept?: boolean;

  options?: string[];
};

export default function ThinkingTurn(props: {
  turn?: Turn;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
}) {
  // Guard: if missing, render nothing
  if (!props.turn) return null;

  // Freeze a non-optional reference so TypeScript stays narrowed everywhere
  const turn: Turn = props.turn;

  const onComplete: (value: string) => void =
    typeof props.onComplete === "function" ? props.onComplete : () => {};

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [value, setValue] = useState<string>(turn.defaultValue ?? "");
  const isDone = !!turn.answer;

  // Reset value when a new turn appears (important for defaultValue turns)
  useEffect(() => {
    setValue(turn.defaultValue ?? "");
  }, [turn.id]); // intentional: reset per new turn

  const wrapText: React.CSSProperties = useMemo(
    () => ({
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
    }),
    []
  );

  const cardStyle = useMemo<React.CSSProperties>(
    () => ({
      borderRadius: 18,
      padding: 18,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(20,34,51,0.85)",
      opacity: isDone ? 0.55 : 1,
      pointerEvents: "auto",
    }),
    [isDone]
  );

  const titleStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: 13,
      letterSpacing: 0.4,
      opacity: 0.7,
      marginBottom: 8,
      textTransform: "none",
      ...wrapText,
    }),
    [wrapText]
  );

  const promptStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: 15,
      marginBottom: 12,
      lineHeight: 1.35,
      ...wrapText,
    }),
    [wrapText]
  );

  const answerStyle = useMemo<React.CSSProperties>(
    () => ({
      marginTop: 10,
      fontStyle: "italic",
      lineHeight: 1.35,
      ...wrapText,
    }),
    [wrapText]
  );

  const fieldStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(0,0,0,0.25)",
      color: "white",
      fontSize: 15,
      lineHeight: 1.35,
      outline: "none",
      resize: "none",
      overflow: "hidden",
      ...wrapText,
    }),
    [wrapText]
  );

  const primaryButtonStyle = useMemo<React.CSSProperties>(
    () => ({
      marginTop: 12,
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      fontWeight: 800,
      background: "#FF7900",
      color: "white",
      border: "none",
      cursor: "pointer",
      ...wrapText,
    }),
    [wrapText]
  );

  function autosize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    autosize();
  }, [value]);

  useEffect(() => {
    if (!props.autoFocus) return;
    if (isDone) return;

    const t = setTimeout(() => {
      if (turn.kind === "write") {
        textareaRef.current?.focus();
        autosize();
      }
    }, 0);

    return () => clearTimeout(t);
  }, [props.autoFocus, isDone, turn.kind]);

  function submitWrite() {
    const trimmed = value.trim();

    if (!trimmed && turn.allowBlankAccept) {
      onComplete((turn.defaultValue ?? "").trim());
      return;
    }

    onComplete(value);
  }

  function disabledWriteButton() {
    const trimmed = value.trim();
    if (turn.allowBlankAccept) return false;
    return !trimmed;
  }

  const actionLabel =
    turn.actionLabel ?? (turn.kind === "confirm" ? "This is right" : "Continue");

  return (
    <div style={cardStyle}>
      {turn.title ? <div style={titleStyle}>{turn.title}</div> : null}
      <p style={promptStyle}>{turn.prompt}</p>

      {/* INFO / BRIDGE TURN */}
      {turn.kind === "info" && !isDone && (
        <button
          onClick={() => onComplete("Continue")}
          style={primaryButtonStyle}
        >
          {actionLabel}
        </button>
      )}

      {/* WRITE TURN (textarea for all data entry so word wrap works) */}
      {turn.kind === "write" && !isDone && (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={turn.placeholder ?? "Type in clean lines…"}
            rows={1}
            style={fieldStyle}
          />

          <button
            onClick={submitWrite}
            disabled={disabledWriteButton()}
            style={{
              ...primaryButtonStyle,
              opacity: disabledWriteButton() ? 0.6 : 1,
              cursor: disabledWriteButton() ? "not-allowed" : "pointer",
            }}
          >
            {actionLabel}
          </button>
        </>
      )}

      {/* CHOICE TURN */}
      {turn.kind === "choice" && !isDone && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(turn.options ?? []).map((opt) => (
            <button
              key={opt}
              onClick={() => onComplete(opt)}
              style={{
                padding: "12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "white",
                cursor: "pointer",
                textAlign: "left",
                lineHeight: 1.3,
                ...wrapText,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* CONFIRM TURN */}
      {turn.kind === "confirm" && !isDone && (
        <div>
          <pre
            style={{
              margin: "0 0 14px",
              fontWeight: 650,
              lineHeight: 1.35,
              fontFamily: "inherit",
              ...wrapText,
            }}
          >
            {turn.prompt}
          </pre>

          <button
            onClick={() => onComplete("Confirmed")}
            style={primaryButtonStyle}
          >
            {actionLabel}
          </button>
        </div>
      )}

      {/* DONE STATE */}
      {isDone && <p style={answerStyle}>{turn.answer}</p>}
    </div>
  );
}
