#!/usr/bin/env bash
set -euo pipefail

echo "===== SYSTEM ====="
node -v || true
npm -v || true

echo
echo "===== GIT ====="
git rev-parse --short HEAD
git status --porcelain=v1 || true
echo
git log -1 --oneline

echo
echo "===== KEY FILE HEADERS ====="
echo "--- AuthShell.tsx (first 60 lines) ---"
sed -n '1,60p' src/components/ui/AuthShell.tsx || true
echo
echo "--- LoginClient.tsx (first 120 lines) ---"
sed -n '1,120p' src/app/\(auth\)/login/LoginClient.tsx || true
echo
echo "--- LoginClient.tsx (AuthShell usage area) ---"
rg -n "AuthShell|title=|subtitle=|cardTitle=|mode=" src/app/\(auth\)/login/LoginClient.tsx || true

echo
echo "===== TYPESCRIPT BUILD ====="
rm -rf .next || true
npm run build
