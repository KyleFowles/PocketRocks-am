/* ============================================================
   FILE: src/app/thinking/page.tsx
   PURPOSE: Placeholder "post-login" page to confirm guard works
   ============================================================ */

export default function ThinkingHome() {
  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "26px 18px" }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>Thinking</h1>
      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8, lineHeight: 1.5 }}>
        You’re authenticated. Next, we’ll replace this with the “Guided Turns” thinking surface.
      </p>
    </main>
  );
}
