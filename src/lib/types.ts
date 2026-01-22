/* ============================================================
   FILE: src/lib/types.ts
   PURPOSE: Domain types (v1)
   ============================================================ */

export type StepId = "step-1";

export type TurnType = "orientation" | "reflection" | "choice" | "codraft";

export type TurnId = "t1" | "t2" | "t3" | "t4";

export type Turn = {
  id: TurnId;
  type: TurnType;
  systemLead: string;
  prompt: string;
  userInput?: string;
  systemOutput?: string;
  completedAt?: number; // epoch ms for UI convenience
};

export type SessionDoc = {
  ownerUid: string;
  step: StepId;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  turns: Turn[];
};
