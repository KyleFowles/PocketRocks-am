/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Client-side Firebase initialization (singleton)
   IMPORTANT:
   - Turbopack/Next only inlines NEXT_PUBLIC_* vars when accessed
     as direct properties (process.env.NEXT_PUBLIC_...).
   - Do NOT use process.env[name] or loops for client env access.
   ============================================================ */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

function requireValue(label: string, value: string | undefined) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    throw new Error(
      `Missing required env var: ${label}\n` +
        `Expected ONE of:\n` +
        `- NEXT_PUBLIC_FIREBASE_API_KEY\n` +
        `- NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY\n` +
        `- NEXT_PUBLIC_FIREBASE_KEY\n` +
        `- NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY`
    );
  }
  return v;
}

function requireAuthDomain(value: string | undefined) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    throw new Error(
      `Missing required env var: Firebase Auth Domain\n` +
        `Expected:\n` +
        `- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    );
  }
  return v;
}

function requireProjectId(value: string | undefined) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    throw new Error(
      `Missing required env var: Firebase Project ID\n` +
        `Expected:\n` +
        `- NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    );
  }
  return v;
}

function requireAppId(value: string | undefined) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    throw new Error(
      `Missing required env var: Firebase App ID\n` +
        `Expected:\n` +
        `- NEXT_PUBLIC_FIREBASE_APP_ID`
    );
  }
  return v;
}

// IMPORTANT: direct property access only (Turbopack-safe)
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY;

const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: requireValue("Firebase API Key", API_KEY),
  authDomain: requireAuthDomain(AUTH_DOMAIN),
  projectId: requireProjectId(PROJECT_ID),
  storageBucket: typeof STORAGE_BUCKET === "string" ? STORAGE_BUCKET.trim() : undefined,
  messagingSenderId:
    typeof MESSAGING_SENDER_ID === "string" ? MESSAGING_SENDER_ID.trim() : undefined,
  appId: requireAppId(APP_ID),
};

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}
