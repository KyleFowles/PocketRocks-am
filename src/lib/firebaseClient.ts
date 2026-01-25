/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Safe Firebase client init (never crashes at import)

   Fixes:
   - Prevents Turbopack/RSC from crashing when env vars load late
   - Avoids import-time requireEnv() failures
   - Ensures Firebase only initializes when config is truly ready

   ============================================================ */

"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* ------------------------------------------------------------
   Lazy-safe config loader
   ------------------------------------------------------------ */

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // If env is not ready yet, do NOT crash during module import
  if (!apiKey || !authDomain || !projectId) {
    console.warn(
      "⚠ Firebase env not loaded yet — skipping init until ready."
    );
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

/* ------------------------------------------------------------
   Firebase App Singleton
   ------------------------------------------------------------ */

export function getFirebaseApp() {
  const config = getFirebaseConfig();

  if (!config) {
    throw new Error(
      "Firebase config missing. Confirm NEXT_PUBLIC_FIREBASE_* env vars exist in .env.local."
    );
  }

  return getApps().length ? getApp() : initializeApp(config);
}

/* ------------------------------------------------------------
   Firebase Services
   ------------------------------------------------------------ */

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp());
}

/* ------------------------------------------------------------
   Convenience Exports
   ------------------------------------------------------------ */

export const auth = getFirebaseAuth();
export const db = getFirestoreDb();
