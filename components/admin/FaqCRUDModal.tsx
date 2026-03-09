"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, X, Loader2 } from "lucide-react";
import { createFaq, updateFaq } from "@/lib/actions/faqs";
import { CATEGORIES } from "@/components/admin/FaqTableShell";
import { FaqSchema, FaqFormValues, fieldCls } from "@/lib/validations/admin";
import { Toast } from "@/components/admin/Toast";
import type { Faq } from "@/types";

// ── Base input class (dark modal) ─────────────────────────────────────────────
const BASE =
  "w-full bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white " +
  "placeholder:text-white/25 focus:outline-none transition-all duration-150";

interface Props { faq?: Faq }

export function FaqCRUDModal({ faq }: Props) {
  const [open, setOpen]           = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [toast, setToast]         = useState(false);
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());
  const isEdit = Boolean(faq);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
  } = useForm<FaqFormValues>({
    resolver: zodResolver(FaqSchema),
    mode:     "onChange",
    defaultValues: {
      question:  faq?.question         ?? "",
      answer:    faq?.answer           ?? "",
      category:  faq?.category         ?? "",
      tags:      faq?.tags?.join(", ") ?? "",
      is_active: faq?.is_active        ?? true,
    },
  });

  const isActive = watch("is_active");

  function openModal() {
    reset({
      question:  faq?.question         ?? "",
      answer:    faq?.answer           ?? "",
      category:  faq?.category         ?? "",
      tags:      faq?.tags?.join(", ") ?? "",
      is_active: faq?.is_active        ?? true,
    });
    setServerError(null);
    setOpen(true);
  }

  // Called when validation fails — trigger shake on each invalid field
  function onInvalid() {
    const fields = new Set(Object.keys(errors));
    setShakingFields(fields);
    setTimeout(() => setShakingFields(new Set()), 500);
  }

  const onSubmit = async (values: FaqFormValues) => {
    setServerError(null);
    const payload = {
      question:  values.question.trim(),
      answer:    values.answer.trim(),
      category:  values.category?.trim() || null,
      tags:      (values.tags ?? "")
        .split(",")
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean),
      is_active: values.is_active,
    };

    const result = isEdit
      ? await updateFaq(faq!.id, payload)
      : await createFaq(payload);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    setToast(true);
    setTimeout(() => setOpen(false), 1200);
  };

  return (
    <>
      <Toast show={toast} onClose={() => setToast(false)} />

      {/* Trigger */}
      <button
        onClick={openModal}
        className={
          isEdit
            ? "text-xs px-2.5 py-1.5 rounded-lg bg-white/8 text-white/60 hover:bg-white/15 transition-colors flex items-center gap-1.5"
            : "flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-[#ef3825] text-white font-semibold hover:bg-[#d42f1d] transition-colors"
        }
      >
        {isEdit ? (
          <><Pencil className="w-3 h-3" /> Edit</>
        ) : (
          <><Plus className="w-4 h-4" /> Add FAQ</>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            suppressHydrationWarning
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">
                {isEdit ? "Edit FAQ" : "New FAQ"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col gap-5 px-6 py-6 overflow-y-auto"
              suppressHydrationWarning
            >

              {/* Question */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
                  Question <span className="text-[#ef3825]">*</span>
                </label>
                <input
                  {...register("question")}
                  placeholder="e.g. How much does HALO Laser cost?"
                  disabled={isSubmitting}
                  className={`${fieldCls(BASE, {
                    error: !!errors.question,
                    dirty: !!dirtyFields.question,
                    valid: !errors.question,
                  })} ${shakingFields.has("question") ? "animate-shake" : ""}`}
                />
                {errors.question && (
                  <p className="text-[11px] font-semibold text-[#ef3825] mt-0.5">
                    {errors.question.message}
                  </p>
                )}
              </div>

              {/* Answer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
                  Answer <span className="text-[#ef3825]">*</span>
                </label>
                <textarea
                  {...register("answer")}
                  placeholder="Write the exact answer clients will see…"
                  rows={5}
                  disabled={isSubmitting}
                  className={`${fieldCls(BASE, {
                    error: !!errors.answer,
                    dirty: !!dirtyFields.answer,
                    valid: !errors.answer,
                  })} resize-none ${shakingFields.has("answer") ? "animate-shake" : ""}`}
                />
                {errors.answer && (
                  <p className="text-[11px] font-semibold text-[#ef3825] mt-0.5">
                    {errors.answer.message}
                  </p>
                )}
              </div>

              {/* Category + Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    disabled={isSubmitting}
                    className={`${BASE} appearance-none`}
                  >
                    <option value="">No category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
                    Tags (comma-separated)
                  </label>
                  <input
                    {...register("tags")}
                    placeholder="botox, pricing, cost"
                    disabled={isSubmitting}
                    className={BASE}
                  />
                </div>
              </div>

              {/* Status toggle */}
              <div className="flex items-center justify-between p-4 bg-white/4 rounded-xl border border-white/8">
                <div>
                  <p className="text-sm font-medium text-white">Published</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Active FAQs are served by the chatbot
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("is_active", !isActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                    isActive ? "bg-[#17a2b8]" : "bg-white/20"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    isActive ? "translate-x-5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  {serverError}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm px-4 py-2 rounded-xl text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl bg-[#17a2b8] text-white font-semibold hover:bg-[#138fa5] transition-colors disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting ? "Processing…" : isEdit ? "Save Changes" : "Add FAQ"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
