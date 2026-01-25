/* ============================================================
   FILE: src/lib/auth.ts
   PURPOSE: Auth helpers used by /thinking
   ============================================================ */

"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "./firebaseClient";

export function listenToAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
