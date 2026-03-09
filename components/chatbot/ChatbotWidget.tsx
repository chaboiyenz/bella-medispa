"use client";

import { MessageCircle, X } from "lucide-react";
import { useChatbot } from "./useChatbot";
import { ChatbotWindow } from "./ChatbotWindow";

/**
 * Lazy-loaded chatbot: floating button (bottom-right) and chat window.
 * Does not block initial page render.
 */
export function ChatbotWidget() {
  const {
    open,
    setOpen,
    messages,
    input,
    setInput,
    loading,
    send,
    containerRef,
    inputRef,
  } = useChatbot();

  return (
    <>
      {open && (
        <ChatbotWindow
          messages={messages}
          loading={loading}
          input={input}
          onInputChange={setInput}
          onSend={send}
          onClose={() => setOpen(false)}
          containerRef={containerRef}
          inputRef={inputRef}
        />
      )}
      <button
        suppressHydrationWarning
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open AI chat assistant"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#17a2b8] text-white shadow-xl shadow-[#17a2b8]/30 hover:bg-[#138fa5] hover:scale-110 transition-all duration-200 flex items-center justify-center"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
