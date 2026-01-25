/* ============================================================
   FILE: src/app/layout.tsx
   PURPOSE: Root layout — no duplicate hero text
   ============================================================ */

import "./globals.css";

export const metadata = {
  title: "PocketRocks",
  description: "The default place people go to think.",
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
