/* ============================================================
   FILE: src/components/ui/FormBits.tsx
   PURPOSE: Tailwind form primitives (input, button, error box)
   ============================================================ */

import React from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm text-white/80">{label}</div>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl bg-white text-black px-4 py-3 outline-none",
        "ring-1 ring-black/10 focus:ring-2 focus:ring-[#FF7900]/60",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-xl bg-[#FF7900] py-3 font-bold text-white",
        "hover:brightness-110 active:brightness-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function LinkButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={[
        "text-sm text-white/70 underline hover:text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className || "",
      ].join(" ")}
    />
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-200 border border-red-500/30">
      {message}
    </div>
  );
}
