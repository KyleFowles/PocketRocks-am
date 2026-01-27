/* ============================================================
   FILE: src/app/(thinking)/thinking/page.tsx
   PURPOSE: PocketRocks AI-first Thinking Partner surface.
            - Unlimited refinement loop (no fixed turns)
            - Calm executive UI (not chat bubbles)
            - Real LLM calls via /api/thinking
   ============================================================ */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ThinkingClientShell from "@/components/thinking/ThinkingClientShell";

type Msg = { role: "user" | "assistant"; content: string; id: string };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function cleanOneLine(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function nowStamp() {
  const d = new Date();
  return d.toLocaleString(undefined, { month: "short", day: "numeric" });
}

export default function ThinkingPage() {
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content:
        "What’s your Rock?\n\nShare it in your own words — messy is fine. I’ll help you sharpen it.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = useMemo(() => {
    return cleanOneLine(draft).length > 0 && !busy;
  }, [draft, busy]);

  useEffect(() => {
    // Auto-scroll on new messages
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages.length]);

  async function send() {
    const text = cleanOneLine(draft);
    if (!text || busy) return;

    setError("");
    setBusy(true);
    setDraft("");

    const userMsg: Msg = { id: uid(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);

    try {
      const res = await fetch("/api/thinking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const assistantText =
        typeof data?.assistantText === "string" ? data.assistantText : "";

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: assistantText.trim() || "Tell me a bit more.",
        },
      ]);
    } catch (e: any) {
      const msg =
        typeof e?.message === "string" ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "I hit an error reaching the model. Try again — or paste your Rock again and I’ll pick up where we left off.",
        },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter to send, Shift+Enter for newline (even though we keep it mostly one-line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <ThinkingClientShell>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "18px 14px 22px",
        }}
      >
        {/* Hero Header */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 30,
                lineHeight: "34px",
                letterSpacing: "-0.02em",
                fontWeight: 800,
              }}
            >
              PocketRocks
            </div>
            <div style={{ opacity: 0.78, marginTop: 4, fontSize: 13 }}>
              The default place leaders go to think. • {nowStamp()}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
              opacity: 0.9,
              whiteSpace: "nowrap",
            }}
          >
            AI-first • Calm by default
          </div>
        </header>

        {/* Conversation Surface */}
        <section
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          <div
            ref={listRef}
            style={{
              maxHeight: "calc(100vh - 260px)",
              overflowY: "auto",
              padding: 16,
            }}
          >
            {messages.map((m) => (
              <MessageRow key={m.id} role={m.role} content={m.content} />
            ))}

            {busy ? (
              <div style={{ padding: "10px 2px", opacity: 0.75, fontSize: 13 }}>
                Thinking…
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: 12,
              background: "rgba(0,0,0,0.18)",
            }}
          >
            {error ? (
              <div
                style={{
                  marginBottom: 10,
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,120,0,0.25)",
                  background: "rgba(255,120,0,0.08)",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your next thought…"
                rows={2}
                style={{
                  flex: 1,
                  resize: "none",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.22)",
                  color: "inherit",
                  padding: "12px 12px",
                  outline: "none",
                  lineHeight: "20px",
                  fontSize: 14,
                }}
              />

              <button
                onClick={send}
                disabled={!canSend}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "12px 14px",
                  fontWeight: 800,
                  cursor: canSend ? "pointer" : "not-allowed",
                  opacity: canSend ? 1 : 0.55,
                  background:
                    "linear-gradient(135deg, rgba(255,121,0,0.95), rgba(240,78,35,0.95))",
                  color: "#142233",
                  minWidth: 110,
                }}
              >
                Send
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
              Enter to send • Shift+Enter for a new line
            </div>
          </div>
        </section>
      </div>
    </ThinkingClientShell>
  );
}

function MessageRow({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 12,
        padding: "10px 2px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.7,
          paddingTop: 2,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {isUser ? "You" : "PocketRocks"}
      </div>

      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          background: isUser ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.045)",
          padding: "12px 14px",
          fontSize: 14,
          lineHeight: "20px",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    </div>
  );
}
