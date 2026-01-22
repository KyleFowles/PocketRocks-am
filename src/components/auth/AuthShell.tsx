/* ============================================================
   FILE: src/components/auth/AuthShell.tsx
   PURPOSE: World-class auth layout shell (centered, responsive)
   ============================================================ */

"use client";

import React from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="pr-bg min-h-screen px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          {/* LEFT: brand narrative */}
          <section className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full border pr-hairline bg-black/20 px-3 py-1 text-xs pr-muted">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="pr-brand">PocketRocks</span>
              <span className="opacity-60">·</span>
              <span>{eyebrow}</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight">
              The default place people go to think.
            </h1>

            <p className="mt-4 text-sm pr-muted leading-6">
              Calm, structured turns that turn vague concerns into clear commitments.
              Private by design. Built for leaders who want clarity without noise.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3 pr-muted">
                <div className="mt-1 h-2 w-2 rounded-full bg-white/30" />
                <p><span className="text-white/85 font-semibold">Guided Turns</span> — one prompt, one action, then lock it in.</p>
              </div>
              <div className="flex items-start gap-3 pr-muted">
                <div className="mt-1 h-2 w-2 rounded-full bg-white/30" />
                <p><span className="text-white/85 font-semibold">Thinking trail</span> — your progress persists across sessions.</p>
              </div>
              <div className="flex items-start gap-3 pr-muted">
                <div className="mt-1 h-2 w-2 rounded-full bg-white/30" />
                <p><span className="text-white/85 font-semibold">Private</span> — your data is owned by you and protected by rules.</p>
              </div>
            </div>
          </section>

          {/* RIGHT: card */}
          <section>
            <div className="mx-auto max-w-md">
              <div className="mb-6 md:hidden">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span className="pr-brand text-lg">PocketRocks</span>
                </div>
                <p className="mt-2 text-sm pr-muted">
                  The default place people go to think.
                </p>
              </div>

              <div className="pr-card pr-topline rounded-2xl p-6 md:p-7">
                <div className="mb-5">
                  <p className="text-xs font-semibold tracking-wide pr-muted">
                    {title}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    {subtitle}
                  </h2>
                </div>

                <div className="space-y-4">{children}</div>

                <div className="mt-5 border-t pr-hairline pt-4">{footer}</div>
              </div>

              <p className="mt-5 text-xs pr-faint leading-5">
                By continuing, you’re creating a private workspace designed to help you
                clarify what matters and commit with confidence.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
