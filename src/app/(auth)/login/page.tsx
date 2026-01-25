/* ============================================================
   FILE: src/app/(auth)/login/page.tsx
   PURPOSE: Login page (Server Component) that wraps client login
            in Suspense to satisfy Next.js CSR bailout rules.
   ============================================================ */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.fallbackWrap}>
          <div style={styles.fallbackCard}>
            <div style={styles.fallbackTitle}>Loading…</div>
            <div style={styles.fallbackText}>Preparing sign-in.</div>
          </div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  fallbackWrap: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
  },
  fallbackCard: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 16,
    border: "1px solid rgba(229,232,235,0.10)",
    background: "rgba(20,34,51,0.25)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    padding: 16,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 6,
  },
  fallbackText: {
    fontSize: 13,
    opacity: 0.8,
  },
};
