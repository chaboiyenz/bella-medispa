"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Faq } from "@/types";

// ── Server-side validation (secondary shield) ─────────────────────────────────
const FaqGuard = z.object({
  question: z.string().min(5,  "Question must be at least 5 characters"),
  answer:   z.string().min(10, "Answer must be at least 10 characters"),
});

export type FaqPayload = {
  question: string;
  answer: string;
  category: string | null;
  tags: string[];
  is_active?: boolean;
};

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("category", { ascending: true })
    .order("question", { ascending: true });
  return data ?? [];
}

export async function createFaq(payload: FaqPayload) {
  const guard = FaqGuard.safeParse(payload);
  if (!guard.success) return { error: guard.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert({
    ...payload,
    is_active: payload.is_active ?? true,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/faqs");
}

export async function updateFaq(id: string, payload: Partial<FaqPayload>) {
  if (payload.question !== undefined || payload.answer !== undefined) {
    const guard = FaqGuard.partial().safeParse(payload);
    if (!guard.success) return { error: guard.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/faqs");
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/faqs");
}

export async function deleteFaqsBulk(ids: string[]) {
  if (!ids.length) return;
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/admin/faqs");
}

export async function updateFaqsCategory(ids: string[], category: string) {
  if (!ids.length) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({ category })
    .in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/admin/faqs");
}
