/* ============================================================
   FILE: src/components/ui/PageShell.tsx
   PURPOSE: Dark auth page backdrop + top bar (logo + pill)
   ============================================================ */

import React from "react";

export default function PageShell({
  children,
  pillText = "Private by design • Calm by default",
}: {
  children: React.ReactNode;
  pillText?: string;
}) {
  return (
    <div className="pr-auth-page">
      <div className="pr-topbar">
        <div className="pr-brandrow">
          <div className="pr-dot" />
          <div className="pr-brandtext">
            <div className="pr-brandname">PocketRocks</div>
            <div className="pr-brandtagline">The default place people go to think.</div>
          </div>
        </div>

        <div className="pr-pill">{pillText}</div>
      </div>

      {children}
    </div>
  );
}
