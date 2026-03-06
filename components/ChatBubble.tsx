"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Bella, your AI Concierge 👋 Ask me anything about our treatments, pricing, or how to book.",
};

export function ChatBubble() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    // Placeholder for streaming response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please call us at +1 302-736-6334.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-slate-400/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-[#0F172A]">
            <div className="relative">
              <Image
                src="/bella.jpg"
                alt="Bella AI"
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-[#17a2b8]/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bella AI Concierge</p>
              <p className="text-[10px] text-white/40">Powered by Groq · Llama 3</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 max-h-[380px] no-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "assistant" && (
                  <Image
                    src="/bella.jpg"
                    alt="Bella"
                    width={24}
                    height={24}
                    className="rounded-full object-cover shrink-0 mt-0.5"
                  />
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#ef3825] text-white rounded-tr-sm"
                      : "bg-[#F8FAFC] text-[#0F172A] rounded-tl-sm border border-[#F1F5F9]"
                  }`}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center h-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {["HALO Laser price?", "Book a consult", "Botox downtime?"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#17a2b8]/30 text-[#17a2b8] hover:bg-[#17a2b8]/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#F1F5F9] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              placeholder="Ask anything…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 text-sm bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-3 py-2 text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#17a2b8] transition-colors"
            />
            <button
              onClick={send}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 rounded-xl bg-[#ef3825] hover:bg-[#17a2b8] text-white flex items-center justify-center transition-colors disabled:opacity-40"
            >
              {streaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open AI chat assistant"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#17a2b8] text-white shadow-xl hover:bg-[#138fa5] hover:scale-110 transition-all duration-200 flex items-center justify-center"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
