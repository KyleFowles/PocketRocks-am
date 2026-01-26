/* ============================================================
   FILE: src/components/thinking/ThinkingSurface.tsx
   PURPOSE:
   - World-class PocketRocks Thinking Surface container
   - Clear hierarchy: Page heading -> Surface -> Turns
   - Avoids “box inside box” heaviness
   ============================================================ */

"use client";

import React from "react";

export default function ThinkingSurface({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: "100%" }}>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                opacity: 0.65,
                marginBottom: 6,
              }}
            >
              PocketRocks Thinking
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "rgba(246,247,251,0.98)",
              }}
            >
              {title}
            </h1>

            {subtitle ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 1.45,
                  maxWidth: 72 * 10, // ~720px
                  opacity: 0.78,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          {rightSlot ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {rightSlot}
            </div>
          ) : null}
        </div>
      </div>

      {/* Surface */}
      <div
        className="pr-surface"
        style={{
          maxWidth: 980,
          borderRadius: 22,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
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
            Guided Turns
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              opacity: 0.85,
            }}
          >
            Step 1
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ display: "grid", gap: 14 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
