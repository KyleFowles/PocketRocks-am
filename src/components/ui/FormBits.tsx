"use client";

import React, { useMemo, useState } from "react";

export function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="pr-field">
      <div className="pr-label">{label}</div>
      <input
        className="pr-input"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);

  const type = useMemo(() => (show ? "text" : "password"), [show]);

  return (
    <div className="pr-field">
      <div className="pr-label">{label}</div>

      <div className="pr-inputrow">
        <input
          className="pr-input"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="pr-show-inline"
          onClick={() => setShow((s) => !s)}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {hint ? <div className="pr-hint">{hint}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button className="pr-primary" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function InlineRow({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return <div className="pr-row">{left}{right}</div>;
}

export function ErrorBox({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className="pr-error">{message}</div>;
}
