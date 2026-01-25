/* ============================================================
   FILE: postcss.config.mjs
   PURPOSE: PostCSS config for Tailwind CSS v4 + Next.js
   NOTES:
   - Tailwind v4 uses the @tailwindcss/postcss plugin
   - Do NOT use "tailwindcss" or "autoprefixer" keys here in v4
   ============================================================ */

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
