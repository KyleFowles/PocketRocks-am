/* ============================================================
   FILE: src/lib/firestore.ts
   PURPOSE: Firestore helpers for PocketRocks sessions + Step 1
   ============================================================ */

"use client";

import { db } from "./firebaseClient";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";

/** Minimal “turn” shape used by Step 1 */
export type ThinkingTurn = {
  kind: "system" | "user";
  text: string;
  ts: number;
};

export type ThinkingSession = {
  ownerUid: string;
  step: "step-1";
  turns: ThinkingTurn[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

const SESSIONS_COL = "pr_sessions";

/** Create a new Step 1 session and return its id */
export async function createStep1Session(ownerUid: string): Promise<string> {
  const ref = await addDoc(collection(db, SESSIONS_COL), {
    ownerUid,
    step: "step-1",
    turns: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies ThinkingSession);

  return ref.id;
}

/** Load the latest Step 1 session id for a user (or null if none) */
export async function loadLatestStep1SessionId(
  ownerUid: string
): Promise<string | null> {
  const q = query(
    collection(db, SESSIONS_COL),
    where("ownerUid", "==", ownerUid),
    where("step", "==", "step-1"),
    orderBy("updatedAt", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0]!.id;
}

/** Load a session document (or null if missing) */
export async function loadSession<T = DocumentData>(
  sessionId: string
): Promise<(T & { id: string }) | null> {
  const ref = doc(db, SESSIONS_COL, sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}

/** Persist turns for a session */
export async function updateSessionTurns(
  sessionId: string,
  turns: ThinkingTurn[]
): Promise<void> {
  const ref = doc(db, SESSIONS_COL, sessionId);
  await updateDoc(ref, {
    turns,
    updatedAt: serverTimestamp(),
  });
}
