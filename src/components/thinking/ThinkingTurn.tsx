/* ============================================================
   FILE: src/components/thinking/ThinkingTurn.tsx
   PURPOSE:
   Reusable “Guided Turn” building block for PocketRocks
   - One system prompt
   - One user action (single-line input)
   - Locks after submit
   - Completed turns remain visible, slightly dimmed
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type ThinkingTurnValue = {
  text: string;
};

export default function ThinkingTurn(props: {
  index: number;
  title?: string;
  systemText: string;
  prompt: string;
  placeholder?: string;
  buttonLabel?: string;
  locked?: boolean;
  value?: ThinkingTurnValue | null;
  onSubmit?: (value: ThinkingTurnValue) => void;
}) {
  const {
    index,
    title,
    systemText,
    prompt,
    placeholder = "Type one sentence…",
    buttonLabel = "Continue",
    locked = false,
    value,
    onSubmit,
  } = props;

  const [text, setText] = useState(value?.text ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => {
    const t = text.trim();
    return !locked && t.length >= 2;
  }, [text, locked]);

  useEffect(() => {
    // Keep local state in sync if parent restores value
    setText(value?.text ?? "");
  }, [value?.text]);

  useEffect(() => {
    if (!locked) {
      // Focus new active turn
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [locked]);

  function submit() {
    if (!canSubmit) return;
    onSubmit?.({ text: text.trim() });
  }

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm",
        locked ? "opacity-80" : "opacity-100",
      ].join(" ")}
      aria-label={`Thinking turn ${index + 1}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Turn {index + 1}
            {title ? ` · ${title}` : ""}
          </div>
          <div className="mt-3 text-base leading-relaxed text-white">
            {systemText}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-white/80">{prompt}</div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          className={[
            "w-full flex-1 rounded-xl bg-white px-4 py-3 text-black outline-none",
            locked ? "opacity-90" : "opacity-100",
          ].join(" ")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={locked}
          autoComplete="off"
          inputMode="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="w-full rounded-xl bg-[#FF7900] px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:w-auto"
        >
          {buttonLabel}
        </button>
      </div>

      {locked && value?.text ? (
        <div className="mt-3 text-sm text-white/60">
          <span className="font-semibold text-white/70">Saved:</span>{" "}
          {value.text}
        </div>
      ) : null}
    </section>
  );
}
