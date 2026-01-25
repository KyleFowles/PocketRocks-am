/* ============================================================
   FILE: src/app/(auth)/layout.tsx
   PURPOSE: Auth route-group layout (keeps auth pages clean)
   NOTES:
   - Removes the duplicate “Private by design…” lines that were
     being rendered from this layout.
   ============================================================ */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
