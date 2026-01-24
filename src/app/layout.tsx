/* ============================================================
   FILE: src/app/layout.tsx
   PURPOSE: Root layout that loads global CSS for ALL routes
   ============================================================ */

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PocketRocks",
  description: "The default place people go to think.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
