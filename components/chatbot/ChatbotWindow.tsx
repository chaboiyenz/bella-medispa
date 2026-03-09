"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Send, Loader2, Phone, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "./useChatbot";

function MdLink({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith("http") || href?.startsWith("tel:");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-[#ef3825] font-semibold hover:underline"
    >
      {children}
    </a>
  );
}

const MD_COMPONENTS = {
  a: MdLink,
  p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-1 last:mb-0">{children}</p>
  ),
  em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
    <em className="not-italic text-[#0F172A]/60 text-[11px]">{children}</em>
  ),
} as const;

interface ChatbotWindowProps {
  messages: ChatMessage[];
  loading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text?: string) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const QUICK_ACTIONS = [
  { label: "HALO Laser price?", message: "How much does HALO Laser cost?" },
  { label: "Book a consultation", message: "How do I book a consultation?" },
  { label: "What is EMSELLA®?", message: "What is EMSELLA?" },
  { label: "Botox downtime?", message: "How long does Botox last?" },
  { label: "View treatments", message: "What anti-aging treatments do you offer?" },
  { label: "Financing options?", message: "Do you offer financing or payment plans?" },
];

export function ChatbotWindow({
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onClose,
  containerRef,
  inputRef,
}: ChatbotWindowProps) {
  return (
    <div
      suppressHydrationWarning
      className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-400/20 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-[#0F172A] shrink-0">
        <div className="relative">
          <Image
            src="/bella.jpg"
            alt="Bella AI"
            width={36}
            height={36}
            className="rounded-full object-cover ring-2 ring-[#17a2b8]/40"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#17a2b8] border-2 border-[#0F172A]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Bella AI Concierge</p>
          <p className="text-[10px] text-[#17a2b8]">Bella MediSpa · Dover, DE</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="ml-auto text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 max-h-[340px]"
      >
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

            {msg.type === "handoff" ? (
              <div className="max-w-[85%] bg-slate-100 text-[#0F172A] rounded-2xl rounded-tl-sm px-4 py-3 flex flex-col gap-3">
                <p className="text-sm leading-relaxed">
                  I want to ensure you get the most accurate medical advice. That specific question is best answered by our specialists.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/book"
                    className="flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-[#ef3825] text-white hover:bg-[#d42f1d] transition-colors"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    Book a Consultation
                  </Link>
                  <a
                    href="tel:+13027366334"
                    className="flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-[#0F172A]/8 text-[#0F172A] hover:bg-[#0F172A]/12 border border-[#0F172A]/10 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call +1 302-736-6334
                  </a>
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#17a2b8] text-white rounded-tr-sm"
                    : "bg-slate-100 text-[#0F172A] rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown components={MD_COMPONENTS}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <Image
              src="/bella.jpg"
              alt="Bella"
              width={24}
              height={24}
              className="rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-2 pb-1 flex gap-1.5 overflow-x-auto border-t border-slate-100 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_ACTIONS.map(({ label, message }) => (
          <button
            key={label}
            onClick={() => onSend(message)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-[#17a2b8]/30 text-[#17a2b8] hover:bg-[#17a2b8]/10 transition-colors whitespace-nowrap shrink-0 disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 flex items-center gap-2 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          placeholder="Ask anything…"
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#0F172A] placeholder:text-slate-300 focus:outline-none focus:border-[#17a2b8] focus:ring-2 focus:ring-[#17a2b8]/15 transition-all"
        />
        <button
          onClick={() => onSend()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-[#17a2b8] hover:bg-[#138fa5] text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
