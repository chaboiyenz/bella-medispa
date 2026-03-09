"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ChatBubble } from "@/components/ChatBubble";

export function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatBubble />}
    </>
  );
}
