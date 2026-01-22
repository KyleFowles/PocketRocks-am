/* ============================================================
   FILE: src/components/ui/Button.tsx
   PURPOSE: Premium PocketRocks buttons (primary/secondary)
   ============================================================ */

"use client";

import React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold " +
    "transition active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-orange-300/35";

  const primary =
    disabled
      ? "bg-white/10 text-white/35 border border-white/10 cursor-not-allowed"
      : "bg-white text-black hover:bg-white/90 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

  const secondary =
    disabled
      ? "bg-transparent text-white/30 border border-white/10 cursor-not-allowed"
      : "bg-transparent text-white/85 border border-white/15 hover:border-white/25 hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variant === "primary" ? primary : secondary} ${className}`}
    >
      {children}
    </button>
  );
}
