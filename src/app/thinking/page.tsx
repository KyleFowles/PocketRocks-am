/* ============================================================
   FILE: src/app/thinking/page.tsx

   PocketRocks — Guided Thinking Route
   Purpose: Render the canonical ThinkingSurface (Guided Turns).

   Notes:
   - Keep this page thin and stable.
   - All turn logic/types live inside components/thinking.

   ============================================================ */

import ThinkingSurface from "@/components/thinking/ThinkingSurface";

export default function ThinkingPage() {
  return (
    <main>
      <ThinkingSurface />
    </main>
  );
}
