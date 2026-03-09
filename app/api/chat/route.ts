import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// ── Fuzzy keyword matcher ─────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "what", "is", "are", "does", "do", "how", "can", "the", "a", "an",
  "my", "your", "i", "me", "we", "you", "it", "in", "at", "on", "for",
  "to", "of", "be", "will", "would", "should", "could", "has", "have",
  "had", "much", "many", "any", "all", "some", "that", "this", "there",
  "about", "get", "tell", "know", "which", "who", "and", "or", "not",
  "with", "from", "by", "as", "up", "out", "into", "just", "like",
]);

const MATCH_THRESHOLD = 0.5;

function keyTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function matchScore(userQuery: string, faqQuestion: string): number {
  const querySet  = new Set(keyTokens(userQuery));
  const faqTokens = keyTokens(faqQuestion);
  if (faqTokens.length === 0) return 0;
  const matched = faqTokens.filter((t) => querySet.has(t)).length;
  return matched / faqTokens.length;
}

// ── "Next Step" CTAs by category ─────────────────────────────────────────────
// These are appended to every matched answer to keep the patient engaged.
const NEXT_STEP: Record<string, string> = {
  Pricing:    "\n\n*Would you like to [Book Online 24/7](https://bellamedispa.com/book) to get an exact quote?*",
  Treatments: "\n\n*Interested in this treatment? [Book Online 24/7](https://bellamedispa.com/book) or [view all treatments →](/treatments).*",
  Booking:    "\n\n*[Book Online 24/7](https://bellamedispa.com/book) or [follow us on Instagram](https://www.instagram.com/bella_medispa_/?hl=en) for the latest updates.*",
  Recovery:   "\n\n*Have more recovery questions? [Book a free consultation →](https://bellamedispa.com/book) with our team.*",
  Safety:     "\n\n*Your safety is our priority. [Book a complimentary consultation →](https://bellamedispa.com/book) or call us at [+1 302-736-6334](tel:+13027366334).*",
};
const DEFAULT_NEXT_STEP =
  "\n\n*Ready to take the next step? [Book Online 24/7](https://bellamedispa.com/book) or [follow us on Instagram](https://www.instagram.com/bella_medispa_/?hl=en) for inspiration.*";

// ── Response types ────────────────────────────────────────────────────────────
export type ChatResponse =
  | { type: "faq";     answer: string }
  | { type: "handoff"; answer: null };

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message: string };

    if (!message?.trim()) {
      return Response.json({ type: "handoff", answer: null } satisfies ChatResponse);
    }

    const supabase = await createClient();

    const { data: faqs } = await supabase
      .from("faqs")
      .select("id, question, answer, category")
      .eq("is_active", true);

    if (!faqs?.length) {
      return Response.json({ type: "handoff", answer: null } satisfies ChatResponse);
    }

    // Score every active FAQ and find the best match
    let bestScore  = 0;
    let bestFaqId  = "";
    let bestAnswer = "";
    let bestCat: string | null = null;

    for (const faq of faqs) {
      const score = matchScore(message, faq.question);
      if (score > bestScore) {
        bestScore  = score;
        bestFaqId  = faq.id;
        bestAnswer = faq.answer;
        bestCat    = faq.category;
      }
    }

    if (bestScore >= MATCH_THRESHOLD) {
      supabase.rpc("increment_faq_usage", { faq_id: bestFaqId }).then(() => {});

      const nextStep = (bestCat && NEXT_STEP[bestCat]) ?? DEFAULT_NEXT_STEP;
      const fullAnswer = bestAnswer + nextStep;

      return Response.json({ type: "faq", answer: fullAnswer } satisfies ChatResponse);
    }

    return Response.json({ type: "handoff", answer: null } satisfies ChatResponse);
  } catch {
    return Response.json({ type: "handoff", answer: null } satisfies ChatResponse, { status: 500 });
  }
}
