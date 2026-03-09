"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { X, Upload, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { ProductSchema, ProductFormValues, fieldCls } from "@/lib/validations/admin";
import { Toast } from "@/components/admin/Toast";
import type { Product } from "@/types";

const CATEGORIES = ["Skincare", "Supplements", "Devices", "Gift Sets", "Other"];

// ── Base input class (light modal) ────────────────────────────────────────────
const BASE =
  "w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-4 py-2.5 text-sm " +
  "text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none transition-all duration-150";

interface Props {
  mode:     "create" | "edit";
  product?: Product;
  open:     boolean;
  onClose:  () => void;
}

export function ProductCRUDModal({ mode, product, open, onClose }: Props) {
  const router                  = useRouter();
  const fileRef                 = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);
  const [uploading, setUploading]       = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const [toast, setToast]               = useState(false);
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    mode:     "onChange",
    defaultValues: {
      name:        product?.name        ?? "",
      description: product?.description ?? "",
      price:       product?.price       ?? 0,
      stock:       product?.stock       ?? 0,
      category:    product?.category    ?? "",
      is_active:   product?.is_active   ?? true,
    },
  });

  const isActive = watch("is_active");

  if (!open) return null;

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

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    setUploading(true);

    let image_url: string | null = product?.image_url ?? null;

    if (imageFile) {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const ext  = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { upsert: true });

      if (uploadError) {
        setServerError(`Image upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    setUploading(false);

    const payload = {
      name:        values.name.trim(),
      description: values.description?.trim() || null,
      price:       values.price,
      stock:       values.stock,
      category:    values.category?.trim() || null,
      image_url,
      is_active:   values.is_active,
    };

    try {
      if (mode === "edit" && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
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

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          suppressHydrationWarning
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#F1F5F9] px-7 py-5 flex items-center justify-between z-10">
            <h2 className="font-serif text-lg font-semibold text-[#0F172A]">
              {mode === "edit" ? "Edit Product" : "New Product"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#94a3b8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="px-7 py-6 flex flex-col gap-4"
            suppressHydrationWarning
          >

            {/* Image upload */}
            <div
              onClick={() => !submitting && fileRef.current?.click()}
              className="w-full h-36 rounded-2xl border-2 border-dashed border-[#F1F5F9] hover:border-[#17a2b8] transition-colors cursor-pointer flex items-center justify-center overflow-hidden bg-[#F8FAFC]"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#CBD5E1]">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Click to upload image</span>
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

            {/* Name */}
            <div className="flex flex-col gap-1">
              <input
                {...register("name")}
                placeholder="Product name *"
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

            {/* Description */}
            <textarea
              {...register("description")}
              placeholder="Description (optional)"
              rows={2}
              disabled={submitting}
              className={`${BASE} resize-none`}
            />

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price ($) *"
                  disabled={submitting}
                  className={`${fieldCls(BASE, {
                    error: !!errors.price,
                    dirty: !!dirtyFields.price,
                    valid: !errors.price,
                  })} ${shakingFields.has("price") ? "animate-shake" : ""}`}
                />
                {errors.price && (
                  <p className="text-[11px] font-semibold text-[#ef3825]">{errors.price.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  {...register("stock", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  placeholder="Stock"
                  disabled={submitting}
                  className={`${fieldCls(BASE, {
                    error: !!errors.stock,
                    dirty: !!dirtyFields.stock,
                    valid: !errors.stock,
                  })} ${shakingFields.has("stock") ? "animate-shake" : ""}`}
                />
                {errors.stock && (
                  <p className="text-[11px] font-semibold text-[#ef3825]">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <select
              {...register("category")}
              disabled={submitting}
              className={BASE}
            >
              <option value="">— Select category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative shrink-0">
                <div className={`w-10 h-5 rounded-full transition-colors ${
                  isActive ? "bg-[#17a2b8]" : "bg-slate-200"
                }`} />
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0.5"
                }`} />
                <button
                  type="button"
                  onClick={() => setValue("is_active", !isActive)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Toggle active"
                />
              </div>
              <span className="text-sm text-[#64748B]">Active (visible in boutique)</span>
            </label>

            {/* Server error */}
            {serverError && (
              <p className="text-xs font-semibold text-[#ef3825] bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {serverError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1 pb-2">
              <button
                type="submit"
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
                  : "Create Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
