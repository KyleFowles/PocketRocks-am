/* ============================================================
   FILE: src/app/(thinking)/layout.tsx
   PURPOSE: Route-group layout wrapper (NO html/body here)
   NOTE: This ensures the root layout + globals.css still apply
   ============================================================ */

export default function ThinkingGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
