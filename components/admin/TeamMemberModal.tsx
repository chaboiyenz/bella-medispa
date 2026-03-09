"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { addTeamMember, updateTeamMember } from "@/lib/actions/team";
import { TeamMemberSchema, TeamMemberFormValues, fieldCls } from "@/lib/validations/admin";
import { Toast } from "@/components/admin/Toast";
import type { TeamMember } from "@/types";

// ── Base input class (light modal) ────────────────────────────────────────────
const BASE =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm " +
  "text-[#0F172A] placeholder:text-[#CBD5E1] " +
  "focus:outline-none focus:ring-1 focus:ring-[#17a2b8]/30 transition-all duration-150";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  mode:    "create" | "edit";
  member?: TeamMember;
  open:    boolean;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function TeamMemberModal({ mode, member, open, onClose }: Props) {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile]           = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState<string | null>(member?.image_url ?? null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading]           = useState(false);
  const [serverError, setServerError]       = useState<string | null>(null);
  const [toast, setToast]                   = useState(false);
  const [shakingFields, setShakingFields]   = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(TeamMemberSchema),
    mode:     "onChange",
    defaultValues: {
      name:            member?.name                         ?? "",
      role:            member?.role                         ?? "",
      credentials:     member?.credentials                  ?? "",
      license_no:      member?.license_no                   ?? "",
      bio:             member?.bio                          ?? "",
      specializations: (member?.specializations ?? []).join(", "),
      display_order:   member?.display_order                ?? 0,
      is_active:       member?.is_active                    ?? true,
    },
  });

  const isActive = watch("is_active");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function onInvalid() {
    const fields = new Set(Object.keys(errors));
    setShakingFields(fields);
    setTimeout(() => setShakingFields(new Set()), 500);
  }

  const onSubmit = async (values: TeamMemberFormValues) => {
    setServerError(null);

    // ── Image upload ─────────────────────────────────────────────────────────
    let image_url = member?.image_url ?? null;
    if (imageFile) {
      setUploading(true);
      setUploadProgress(10);

      const supabase = createClient();
      const ext  = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setUploadProgress(40);
      const { error: uploadError } = await supabase.storage
        .from("team-photos")
        .upload(path, imageFile, { upsert: true });

      if (uploadError) {
        setServerError(`Image upload failed: ${uploadError.message}`);
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(90);
      const { data: urlData } = supabase.storage
        .from("team-photos")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
      setUploadProgress(100);
      setUploading(false);
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    const payload = {
      name:            values.name.trim(),
      role:            values.role.trim(),
      credentials:     values.credentials?.trim() || null,
      license_no:      values.license_no?.trim()  || null,
      bio:             values.bio?.trim()          || null,
      image_url,
      specializations: (values.specializations ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      display_order: values.display_order,
      is_active:     values.is_active,
    };

    try {
      if (mode === "edit" && member) {
        await updateTeamMember(member.id, payload);
      } else {
        await addTeamMember(payload);
      }
      setToast(true);
      router.refresh();
      setTimeout(onClose, 1200);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const submitting = uploading || isSubmitting;

  return (
    <>
      <Toast show={toast} onClose={() => setToast(false)} />

      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-0 border-0">

          <DialogHeader className="sticky top-0 bg-white border-b border-slate-100 px-7 py-5 z-10">
            <DialogTitle className="font-serif text-lg font-semibold text-[#0F172A]">
              {mode === "edit" ? "Edit Specialist" : "Add Specialist"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="px-7 py-6 flex flex-col gap-4"
            suppressHydrationWarning
          >

            {/* Image upload */}
            <div
              onClick={() => !submitting && fileRef.current?.click()}
              className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#17a2b8] transition-colors cursor-pointer flex items-center justify-center overflow-hidden bg-slate-50"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#CBD5E1]">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Click to upload photo</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
              className="hidden"
            />

            {/* Upload progress bar */}
            {uploading && (
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#ef3825] transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1">
              <input
                {...register("name")}
                placeholder="Full name *"
                disabled={submitting}
                className={`${fieldCls(BASE, {
                  error: !!errors.name,
                  dirty: !!dirtyFields.name,
                  valid: !errors.name,
                })} ${shakingFields.has("name") ? "animate-shake" : ""}`}
              />
              {errors.name && (
                <p className="text-[11px] font-semibold text-[#ef3825]">{errors.name.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <input
                {...register("role")}
                placeholder="Professional title *  (e.g. Aesthetic Nurse Injector)"
                disabled={submitting}
                className={`${fieldCls(BASE, {
                  error: !!errors.role,
                  dirty: !!dirtyFields.role,
                  valid: !errors.role,
                })} ${shakingFields.has("role") ? "animate-shake" : ""}`}
              />
              {errors.role && (
                <p className="text-[11px] font-semibold text-[#ef3825]">{errors.role.message}</p>
              )}
            </div>

            {/* Credentials + License */}
            <div className="grid grid-cols-2 gap-3">
              <input
                {...register("credentials")}
                placeholder="Credentials  (e.g. NP-C)"
                disabled={submitting}
                className={BASE}
              />
              <input
                {...register("license_no")}
                placeholder="License / NPI"
                disabled={submitting}
                className={BASE}
              />
            </div>

            {/* Bio */}
            <textarea
              {...register("bio")}
              placeholder="Bio (optional)"
              rows={3}
              disabled={submitting}
              className={`${BASE} resize-none`}
            />

            {/* Specializations */}
            <div>
              <textarea
                {...register("specializations")}
                placeholder="Specializations — comma-separated (e.g. BOTOX®, Dermal Fillers, PRP)"
                rows={2}
                disabled={submitting}
                className={`${BASE} resize-none`}
              />
              <p className="mt-1 text-[10px] text-[#94a3b8]">Separate each specialty with a comma.</p>
            </div>

            {/* Display order + Active toggle */}
            <div className="flex items-center gap-4">
              <input
                {...register("display_order", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="Order"
                disabled={submitting}
                className={`${BASE} w-24`}
              />
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="relative shrink-0">
                  <div className={`w-10 h-5 rounded-full transition-colors ${isActive ? "bg-[#17a2b8]" : "bg-slate-200"}`} />
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                  <button
                    type="button"
                    onClick={() => setValue("is_active", !isActive)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Toggle active"
                  />
                </div>
                <span className="text-sm text-[#64748B]">Active (visible on team page)</span>
              </label>
            </div>

            {serverError && (
              <p className="text-xs font-semibold text-[#ef3825] bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {serverError}
              </p>
            )}

          </form>

          <DialogFooter className="px-7 pb-6 flex items-center gap-3">
            <button
              type="submit"
              form=""
              onClick={handleSubmit(onSubmit, onInvalid)}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ef3825] text-white font-semibold text-sm hover:bg-[#17a2b8] disabled:opacity-60 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading
                ? "Uploading…"
                : isSubmitting
                ? "Processing…"
                : mode === "edit"
                ? "Save Changes"
                : "Add Specialist"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Cancel
            </button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </>
  );
}
