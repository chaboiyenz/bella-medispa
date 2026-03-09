"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/ChatbotWidget").then((m) => ({ default: m.ChatbotWidget })),
  { ssr: false }
);

export function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatbotWidget />}
    </>
  );
}
