import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT_BASE = `You are the AI Concierge for Bella MediSpa — a premium aesthetic clinic in Dover, Delaware.

RULES:
- Answer ONLY using the FAQ knowledge base provided below.
- Be warm, professional, and concise (2–4 sentences max per reply).
- Always recommend booking a free consultation for complex questions.
- If a question is outside the FAQ context, say: "For more details, call us at +1 302-736-6334 or book a free consultation at bellamedispa.com/book."
- NEVER invent medical advice or prices not listed in the FAQ.
- Do not discuss competitors.

KNOWLEDGE BASE:
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    // Fetch FAQ context from Supabase (anon key — publicly readable)
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: faq } = await supabase
      .from("faq_kb")
      .select("topic, content")
      .order("topic");

    const context = faq?.map((f) => `[${f.topic}]: ${f.content}`).join("\n\n") ?? "";
    const systemPrompt = SYSTEM_PROMPT_BASE + (context || "No FAQ data loaded yet.");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const stream = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      max_tokens:  512,
      temperature: 0.4,
      stream:      true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    // Stream the response back as plain text chunks
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response("Service temporarily unavailable.", { status: 500 });
  }
}
