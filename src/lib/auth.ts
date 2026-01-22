/* ============================================================
   FILE: src/lib/auth.ts
   PURPOSE: Browser auth helpers
   ============================================================ */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebaseClient";

export function listenToAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signup(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}
