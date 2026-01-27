/* ============================================================
   FILE: src/app/api/thinking/route.ts
   PURPOSE: PocketRocks AI-first Thinking Partner (server-side)
            Uses OpenAI Responses API (/v1/responses).
            - Unlimited refinement (no fixed turn count)
            - Structure is invisible: we steer toward clarity naturally
   ENV:
     - OPENAI_API_KEY (required)
     - OPENAI_MODEL (optional, default: "gpt-5")
   ============================================================ */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

function clean(s: unknown) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function extractOutputText(resp: any): string {
  // 1) If the API provides a convenience "output_text", use it.
  const direct =
    typeof resp?.output_text === "string" ? resp.output_text.trim() : "";
  if (direct) return direct;

  // 2) Otherwise, gather ALL text parts across the entire output array.
  const out = resp?.output;
  const chunks: string[] = [];

  if (Array.isArray(out)) {
    for (const item of out) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;

      for (const part of content) {
        // Text parts are typically { type: "output_text", text: "..." } or similar
        const t = typeof part?.text === "string" ? part.text : "";
        if (t) chunks.push(t);
      }
    }
  }

  const joined = chunks.join("\n").trim();
  if (joined) return joined;

  // 3) Last resort: legacy-style fallback
  const fallback = clean(resp?.choices?.[0]?.message?.content || "");
  return fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const userText = clean(body?.userText);

    // Accept either:
    // - full messages array, or
    // - messages + userText
    const convo: Msg[] = [];
    for (const m of messages) {
      const role = m?.role === "assistant" ? "assistant" : "user";
      const content = clean(m?.content);
      if (content) convo.push({ role, content });
    }
    if (userText) convo.push({ role: "user", content: userText });

    if (!convo.length) {
      return NextResponse.json(
        { error: "Missing messages/userText." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    const model = clean(process.env.OPENAI_MODEL) || "gpt-5";

    // PocketRocks: AI-first thinking partner, structure is invisible.
    const system = `
You are PocketRocks — an AI-first thinking partner for bright, motivated leaders.
Your job is to help the user expand their thinking and refine a Rock-like commitment over time.

STYLE
- Calm, executive, direct. No fluff.
- Be genuinely helpful: reflect, sharpen, reveal assumptions, propose tighter wording.
- Do NOT force a scripted sequence or a fixed number of questions.
- Do NOT mention "SMART" unless the user asks. Instead, naturally steer toward:
  - a clear outcome ("done looks like...")
  - measurability ("how will we know?")
  - timeframe ("by when?")
  - scope ("what is / isn't included?")
  - ownership ("who owns this?") when relevant
- Vary your moves: sometimes ask a question, sometimes propose a rewrite, sometimes list options.

BEHAVIOR
- Always start by briefly reflecting what you heard (1–2 sentences).
- Then choose ONE best next move:
  A) Offer a tighter draft of the Rock (one sentence)
  B) Offer 2–4 alternative framings
  C) Ask 1 strong clarifying question that unlocks progress
  D) Surface a hidden tradeoff / assumption
- If user gives a messy brain-dump, help them turn it into something actionable.
- If they’re stuck, propose a concrete next step.

OUTPUT FORMAT
Return plain text only.
`.trim();

    const input = [
      { role: "system", content: system },
      ...convo.map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 700,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `OpenAI error (${res.status}): ${t || res.statusText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const assistantText = extractOutputText(data) || "Tell me a bit more.";

    return NextResponse.json({
      assistantText,
    });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
