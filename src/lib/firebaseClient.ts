/* ============================================================
   FILE: src/lib/firebaseClient.ts
   PURPOSE: Safe Firebase client init (lazy + never crashes at import)

   Key rules:
   - Do NOT initialize Firebase at import time
   - Only initialize inside getter functions
   - Provide service getters: getFirebaseApp(), getFirebaseAuth(), getFirestoreDb()

   ============================================================ */

"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/* ------------------------------------------------------------
   Lazy-safe config loader
   ------------------------------------------------------------ */

function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // If env is not ready yet, do NOT crash during module import
  if (!apiKey || !authDomain || !projectId) {
    // This can happen in some dev/build phases. We fail only when services are requested.
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
   Firebase App Singleton (lazy)
   ------------------------------------------------------------ */

export function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();

  if (!config) {
    throw new Error(
      "Firebase config missing. Confirm NEXT_PUBLIC_FIREBASE_* env vars exist in .env.local and in your deploy env."
    );
  }

  return getApps().length ? getApp() : initializeApp(config);
}

/* ------------------------------------------------------------
   Firebase Services (lazy)
   ------------------------------------------------------------ */

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
