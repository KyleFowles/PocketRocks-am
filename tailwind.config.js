/* ============================================================
   FILE: tailwind.config.js
   PURPOSE: Tailwind content scanning for Next.js App Router
   NOTES:
   - Keep this even in Tailwind v4 if you want explicit control
   - "content" must include src/app and any component folders
   ============================================================ */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
