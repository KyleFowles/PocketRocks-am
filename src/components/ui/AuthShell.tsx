/* ============================================================
   FILE: src/components/ui/AuthShell.tsx
   PURPOSE: Premium auth shell (world-class feel)
            - Branded header with split-color wordmark: Pocket + Rocks
            - True glass + layered depth + highlight lines
            - Sharper typography + hierarchy
            - Crafted inputs + premium CTA button
            - Responsive: stacks on mobile
   ============================================================ */

import React from "react";

type AuthShellProps = {
  variant?: "login" | "signup";
  pillText?: string;

  brandTitle?: string; // kept for compatibility (ignored visually)
  brandSubtitle?: string;

  eyebrow?: string;
  heroTitle?: string;
  heroBody?: string;

  cardTitle?: string;
  children: React.ReactNode;

  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;

  finePrint?: React.ReactNode;
};

export default function AuthShell({
  variant = "login",
  pillText = "Private by design • Calm by default",

  // brandTitle is intentionally not used directly; we render a styled wordmark instead
  brandTitle = "PocketRocks",
  brandSubtitle = "The default place people go to think.",

  eyebrow = variant === "signup" ? "NEW ACCOUNT" : "WELCOME BACK",
  heroTitle = variant === "signup" ? "Start your private thinking trail" : "Welcome back.",
  heroBody =
    variant === "signup"
      ? "One account. Your private workspace. A calm place to get clear and follow through."
      : "Pick up where you left off. One calm step at a time.",

  cardTitle = variant === "signup" ? "Create account" : "Sign in",
  children,

  footerLeft,
  footerRight,

  finePrint,
}: AuthShellProps) {
  return (
    <div className="pr-auth-page">
      <div className="pr-auth-top">
        <div className="pr-auth-brand">
          <span className="pr-auth-dot" aria-hidden="true" />

          <div className="pr-auth-brandtext">
            {/* World-class wordmark */}
            <div className="pr-wordmark" aria-label={brandTitle}>
              <span className="pr-wordmark-pocket">Pocket</span>
              <span className="pr-wordmark-rocks">Rocks</span>
            </div>

            <div className="pr-auth-brandsub">{brandSubtitle}</div>
          </div>
        </div>

        <div className="pr-auth-pill">{pillText}</div>
      </div>

      <div className="pr-auth-grid">
        <section className="pr-auth-hero">
          <div className="pr-auth-eyebrow">{eyebrow}</div>
          <h1 className="pr-auth-herotitle">{heroTitle}</h1>
          <p className="pr-auth-herobody">{heroBody}</p>
        </section>

        <section className="pr-auth-cardwrap">
          <div className="pr-auth-card">
            <div className="pr-auth-cardheader">
              <div className="pr-auth-cardtitle">{cardTitle}</div>
            </div>

            <div className="pr-auth-cardbody">{children}</div>

            {(footerLeft || footerRight) && (
              <div className="pr-auth-cardfooter">
                <div className="pr-auth-footleft">{footerLeft}</div>
                <div className="pr-auth-footright">{footerRight}</div>
              </div>
            )}

            {finePrint && <div className="pr-auth-fine">{finePrint}</div>}
          </div>
        </section>
      </div>

      <style jsx global>{`
        :root {
          --pr-ink: rgba(229, 232, 235, 0.96);
          --pr-ink-dim: rgba(229, 232, 235, 0.78);
          --pr-ink-faint: rgba(229, 232, 235, 0.62);

          --pr-line: rgba(229, 232, 235, 0.14);
          --pr-line-soft: rgba(229, 232, 235, 0.10);

          --pr-glass: rgba(14, 22, 34, 0.52);
          --pr-glass-2: rgba(20, 34, 51, 0.34);

          --pr-orange: #ff7900;
          --pr-red: #f04e23;
        }

        .pr-auth-page {
          min-height: 100vh;
          padding: 20px 22px 28px;

          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
            "Apple Color Emoji", "Segoe UI Emoji";
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;

          color: var(--pr-ink);

          background:
            radial-gradient(900px 540px at 22% 18%, rgba(255, 121, 0, 0.18) 0%, rgba(255, 121, 0, 0) 64%),
            radial-gradient(900px 560px at 62% 18%, rgba(240, 78, 35, 0.12) 0%, rgba(240, 78, 35, 0) 60%),
            radial-gradient(1200px 820px at 40% 84%, rgba(20, 34, 51, 0.98) 0%, rgba(9, 14, 22, 0.99) 62%, rgba(6, 10, 16, 1) 100%);
        }

        .pr-auth-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
        }

        .pr-auth-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pr-auth-dot {
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: var(--pr-orange);
          box-shadow:
            0 0 0 6px rgba(255, 121, 0, 0.14),
            0 18px 40px rgba(255, 121, 0, 0.16);
          flex: 0 0 auto;
        }

        .pr-auth-brandtext {
          display: flex;
          flex-direction: column;
          gap: 5px;
          line-height: 1.06;
        }

        /* =========================
           WORDMARK (the hero)
           ========================= */
        .pr-wordmark {
          display: inline-flex;
          align-items: baseline;
          gap: 0px;
          line-height: 1;
          letter-spacing: -0.6px;
          font-weight: 950;
          font-size: 20px; /* hero, but controlled */
        }

        .pr-wordmark-pocket {
          color: rgba(229, 232, 235, 0.98);
          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.06),
            0 14px 46px rgba(0, 0, 0, 0.35);
        }

        .pr-wordmark-rocks {
          margin-left: 2px;

          /* Orange gradient text */
          background: linear-gradient(180deg, rgba(255, 121, 0, 0.98) 0%, rgba(240, 78, 35, 0.92) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;

          /* Soft glow, not overpowering */
          filter: drop-shadow(0 10px 26px rgba(255, 121, 0, 0.14))
            drop-shadow(0 18px 50px rgba(0, 0, 0, 0.25));
        }

        .pr-auth-brandsub {
          font-size: 13px;
          opacity: 0.74;
        }

        .pr-auth-pill {
          font-size: 12.5px;
          font-weight: 750;
          padding: 10px 14px;
          border-radius: 999px;
          color: rgba(229, 232, 235, 0.90);
          border: 1px solid rgba(229, 232, 235, 0.12);
          background:
            linear-gradient(180deg, rgba(229, 232, 235, 0.06) 0%, rgba(229, 232, 235, 0.03) 100%),
            rgba(12, 18, 28, 0.35);
          box-shadow:
            0 18px 60px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          white-space: nowrap;
        }

        .pr-auth-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 34px;
          align-items: start;
          max-width: 1180px;
          margin: 0 auto;
        }

        .pr-auth-hero {
          padding-top: 18px;
        }

        .pr-auth-eyebrow {
          font-size: 11px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          color: var(--pr-ink-faint);
          margin-bottom: 14px;
        }

        .pr-auth-herotitle {
          font-size: clamp(44px, 4.8vw, 64px);
          line-height: 1.02;
          letter-spacing: -1.1px;
          margin: 0 0 14px 0;
          font-weight: 900;
          max-width: 660px;
        }

        .pr-auth-herobody {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: var(--pr-ink-dim);
          max-width: 560px;
        }

        .pr-auth-cardwrap {
          display: flex;
          justify-content: flex-end;
          padding-top: 6px;
        }

        .pr-auth-card {
          width: 100%;
          max-width: 560px;
          border-radius: 22px;
          position: relative;
          overflow: hidden;

          background:
            radial-gradient(900px 420px at 18% 10%, rgba(255, 121, 0, 0.10) 0%, rgba(255, 121, 0, 0) 55%),
            radial-gradient(900px 420px at 88% 20%, rgba(240, 78, 35, 0.08) 0%, rgba(240, 78, 35, 0) 55%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%),
            var(--pr-glass);

          border: 1px solid rgba(229, 232, 235, 0.12);

          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.52),
            0 20px 50px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);

          backdrop-filter: blur(16px);
        }

        .pr-auth-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 22px;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.10) 0%,
            rgba(255, 255, 255, 0.04) 40%,
            rgba(255, 255, 255, 0.02) 100%
          );
          mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
          -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
          padding: 1px;
          opacity: 0.9;
        }

        .pr-auth-cardheader {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(229, 232, 235, 0.08);
        }

        .pr-auth-cardtitle {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.2px;
          color: rgba(229, 232, 235, 0.95);
        }

        .pr-auth-cardbody {
          padding: 18px 20px 14px;
        }

        .pr-auth-cardfooter {
          padding: 0 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid rgba(229, 232, 235, 0.06);
          padding-top: 14px;
          margin-top: 10px;
        }

        .pr-auth-footleft,
        .pr-auth-footright {
          font-size: 13.5px;
          color: rgba(229, 232, 235, 0.78);
        }

        .pr-auth-fine {
          padding: 14px 20px 18px;
          border-top: 1px solid rgba(229, 232, 235, 0.06);
          font-size: 12.5px;
          color: rgba(229, 232, 235, 0.62);
          line-height: 1.45;
        }

        .pr-auth-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .pr-auth-label {
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: rgba(229, 232, 235, 0.78);
        }

        .pr-auth-input {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          border-radius: 14px;

          background: rgba(255, 255, 255, 0.10);
          color: rgba(229, 232, 235, 0.95);

          border: 1px solid rgba(229, 232, 235, 0.14);

          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 18px 60px rgba(0, 0, 0, 0.18);

          outline: none;
        }

        .pr-auth-input::placeholder {
          color: rgba(229, 232, 235, 0.50);
        }

        .pr-auth-input:focus {
          border-color: rgba(255, 121, 0, 0.34);
          box-shadow:
            0 0 0 4px rgba(255, 121, 0, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .pr-auth-btn {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(255, 121, 0, 0.34);

          background:
            radial-gradient(120% 140% at 30% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%),
            linear-gradient(180deg, rgba(255, 121, 0, 0.92) 0%, rgba(240, 78, 35, 0.82) 100%);

          color: #ffffff;
          font-weight: 900;
          letter-spacing: 0.2px;
          font-size: 15px;

          cursor: pointer;

          box-shadow:
            0 16px 50px rgba(255, 121, 0, 0.18),
            0 26px 90px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
        }

        .pr-auth-btn:hover {
          transform: translateY(-1px);
          filter: saturate(1.05);
          box-shadow:
            0 18px 62px rgba(255, 121, 0, 0.22),
            0 28px 110px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.20);
        }

        .pr-auth-btn:active {
          transform: translateY(0px);
        }

        .pr-auth-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.10);
        }

        .pr-auth-link {
          color: rgba(255, 121, 0, 0.95);
          font-weight: 900;
          text-decoration: none;
        }

        .pr-auth-link:hover {
          text-decoration: underline;
        }

        .pr-auth-error {
          margin: 10px 0 14px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(240, 78, 35, 0.35);
          background: rgba(240, 78, 35, 0.10);
          color: rgba(229, 232, 235, 0.96);
          font-size: 13px;
          line-height: 1.35;
        }

        @media (max-width: 980px) {
          .pr-auth-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .pr-auth-cardwrap {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .pr-auth-page {
            padding: 16px 14px 24px;
          }

          .pr-auth-pill {
            display: none;
          }

          .pr-wordmark {
            font-size: 18px;
          }

          .pr-auth-herotitle {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
}
