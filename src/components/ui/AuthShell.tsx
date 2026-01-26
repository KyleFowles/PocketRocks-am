/* ============================================================
   FILE: src/components/ui/AuthShell.tsx

   PocketRocks — Auth Shell (premium layout)
   - Two-column layout on desktop, single column on mobile
   - Safe prop surface: accepts title/subtitle/cardTitle/mode
   - Allows extra props so other callers won’t break

   ============================================================ */

import React from "react";

export type AuthShellProps = React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  cardTitle?: string;
  mode?: string;
  footnote?: React.ReactNode;
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}>;

export default function AuthShell(props: AuthShellProps) {
  const {
    children,
    title,
    subtitle,
    cardTitle,
    footnote,
    maxWidth = 1080,
    className,
    style,
    mode,
    ...rest
  } = props;

  void mode;

  return (
    <main
      {...rest}
      className={className}
      style={{
        minHeight: "100vh",
        padding: "42px 18px",
        display: "flex",
        justifyContent: "center",
        background:
          "radial-gradient(900px 420px at 20% 10%, rgba(255,121,0,0.16), rgba(0,0,0,0) 60%), radial-gradient(900px 420px at 80% 70%, rgba(240,78,35,0.10), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(10,12,16,1), rgba(12,14,18,1))",
        color: "rgba(255,255,255,0.92)",
        ...style,
      }}
    >
      <section style={{ width: "100%", maxWidth }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              padding: 22,
              boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: 0.6, opacity: 0.72, fontWeight: 800 }}>
              POCKETROCKS
            </div>

            {title ? (
              <h1 style={{ margin: "10px 0 0", fontSize: 30, lineHeight: 1.1, fontWeight: 900 }}>
                {title}
              </h1>
            ) : null}

            {subtitle ? (
              <p style={{ margin: "12px 0 0", opacity: 0.78, lineHeight: 1.5, fontSize: 15 }}>
                {subtitle}
              </p>
            ) : (
              <p style={{ margin: "12px 0 0", opacity: 0.68, lineHeight: 1.5, fontSize: 15 }}>
                One calm step at a time.
              </p>
            )}

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(255,121,0,0.18)",
                background: "rgba(255,121,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, opacity: 0.9, marginBottom: 6 }}>
                What you can expect
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, opacity: 0.8, fontSize: 14 }}>
                <li>Clear prompts</li>
                <li>No busywork</li>
                <li>A grounded plan you can act on</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              padding: 18,
              boxShadow: "0 28px 80px rgba(0,0,0,0.38)",
            }}
          >
            {cardTitle ? (
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>{cardTitle}</div>
            ) : null}

            <div>{children}</div>

            {footnote ? (
              <div style={{ marginTop: 14, fontSize: 13, opacity: 0.72, lineHeight: 1.45 }}>
                {footnote}
              </div>
            ) : null}
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            main > section > div {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </main>
  );
}
