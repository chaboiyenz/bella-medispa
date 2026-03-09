"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  type?: "faq" | "handoff";
}

const WELCOME: ChatMessage = {
  role: "assistant",
  type: "faq",
  content:
    "Hi! I'm Bella, your AI Concierge ✨ Ask me anything about our treatments, pricing, or booking.",
};

export function useChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevCount = useRef(messages.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (messages.length > prevCount.current) {
      container.scrollTop = container.scrollHeight;
    }
    prevCount.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (loading) {
      const container = containerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = useCallback(async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = (await res.json()) as { type: "faq" | "handoff"; answer: string | null };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: data.type, content: data.answer ?? "" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "handoff", content: "" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return {
    open,
    setOpen,
    messages,
    input,
    setInput,
    loading,
    send,
    containerRef,
    inputRef,
  };
}
