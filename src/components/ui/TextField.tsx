/* ============================================================
   FILE: src/components/ui/TextField.tsx
   PURPOSE: Premium PocketRocks input (label + hint + error-ready)
   ============================================================ */

"use client";

import React from "react";

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
  autoFocus?: boolean;
  disabled?: boolean;
};

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  hint,
  autoFocus,
  disabled,
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="text-xs font-semibold tracking-wide text-white/70">
          {label}
        </label>
      ) : null}

      <div className="rounded-xl border pr-hairline bg-black/25 px-3 py-2.5 focus-within:border-white/20 focus-within:ring-2 focus-within:ring-orange-300/20">
        <input
          type={type}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none disabled:opacity-60"
        />
      </div>

      {hint ? <p className="text-xs pr-faint">{hint}</p> : null}
    </div>
  );
}
