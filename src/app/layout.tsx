/* ============================================================
   FILE: src/app/layout.tsx
   PURPOSE: Root layout (Next.js App Router)
   - REQUIRED: must include <html> and <body>
   - Loads globals.css once for the entire app
   ============================================================ */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PocketRocks",
  description: "A calm place to think clearly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
