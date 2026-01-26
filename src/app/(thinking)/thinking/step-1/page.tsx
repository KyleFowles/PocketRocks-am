/* ============================================================
   FILE: src/app/(thinking)/thinking/step-1/page.tsx
   PURPOSE: Step 1 — Guided Turns container
   ============================================================ */

import ThinkingClientShell from "@/components/thinking/ThinkingClientShell";
import Step1 from "@/components/thinking/Step1";

export default function Step1Page() {
  return (
    <ThinkingClientShell>
      <Step1 />
    </ThinkingClientShell>
  );
}
