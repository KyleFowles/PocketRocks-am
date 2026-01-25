/* ============================================================
   FILE: src/app/(thinking)/thinking/layout.tsx
   PURPOSE: Layout wrapper for /thinking routes (top-aligned)
   ============================================================ */

import type { ReactNode } from "react";

export const metadata = {
  title: "PocketRocks — Thinking",
};

export default function ThinkingLayout({ children }: { children: ReactNode }) {
  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.brandDot} aria-hidden="true" />
            <div style={styles.brandText}>
              <div style={styles.brandTitle}>PocketRocks</div>
              <div style={styles.brandSubtitle}>Thinking</div>
            </div>
          </div>
        </header>

        <main style={styles.main}>{children}</main>

        <footer style={styles.footer}>
          <span style={styles.footerText}>Calm focus. One step at a time.</span>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "flex-start", // ✅ was center — this removes the “empty main feel”
    padding: "18px 16px 28px", // slightly tighter top padding
    background:
      "linear-gradient(180deg, rgba(20,34,51,1) 0%, rgba(10,16,24,1) 70%, rgba(6,10,16,1) 100%)",
    color: "rgba(229,232,235,0.96)",
  },
  shell: {
    width: "100%",
    maxWidth: 860,
    borderRadius: 20,
    border: "1px solid rgba(229,232,235,0.10)",
    background: "rgba(20,34,51,0.42)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
    overflow: "hidden",
  },
  header: {
    padding: "18px 18px 12px",
    borderBottom: "1px solid rgba(229,232,235,0.08)",
    background: "rgba(20,34,51,0.55)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#FF7900",
    boxShadow: "0 0 0 4px rgba(255,121,0,0.18)",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  main: {
    padding: "16px 18px", // slightly tighter
  },
  footer: {
    padding: "12px 18px 16px",
    borderTop: "1px solid rgba(229,232,235,0.08)",
    background: "rgba(20,34,51,0.35)",
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
};
