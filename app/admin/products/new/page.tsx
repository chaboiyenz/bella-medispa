"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { createProduct } from "@/lib/actions/admin";
import { Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Skincare", "Supplements", "Devices", "Gift Sets", "Other"];

const INPUT =
  "w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3 text-sm text-white " +
  "placeholder:text-white/30 focus:outline-none focus:border-[#17a2b8] transition-colors";

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    category: "",
    is_active: true,
  });
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Product name is required."); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) { setError("Enter a valid price."); return; }
    const stock = parseInt(form.stock, 10);
    if (isNaN(stock) || stock < 0) { setError("Enter a valid stock quantity."); return; }

    setError(null);
    setUploading(true);

    let image_url: string | null = null;

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
        setError(`Image upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      image_url = urlData.publicUrl;
    }

    setUploading(false);

    try {
      await createProduct({
        name:        form.name.trim(),
        description: form.description.trim() || null,
        price,
        stock,
        category:    form.category.trim() || null,
        image_url,
        is_active:   form.is_active,
      });
      startTransition(() => router.push("/admin/products"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product.");
    }
  }

  const submitting = uploading || isPending;

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/products" className="text-white/40 hover:text-white text-sm transition-colors">
          ← Products
        </Link>
        <span className="text-white/20">/</span>
        <h1 className="text-2xl font-serif font-semibold text-white">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
            Product Image
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-full h-48 rounded-2xl border-2 border-dashed border-white/15 hover:border-white/30 transition-colors cursor-pointer flex items-center justify-center overflow-hidden bg-white/5"
          >
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/30">
                <Upload className="w-8 h-8" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">PNG, JPG, WEBP</span>
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
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
            Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Hydrating Vitamin C Serum"
            className={INPUT}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief product description…"
            rows={3}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
              Price ($) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="49.99"
              className={INPUT}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className={INPUT}
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white/40 tracking-wide uppercase">
            Category
          </label>
          <select name="category" value={form.category} onChange={handleChange} className={INPUT}>
            <option value="">— Select category —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${form.is_active ? "bg-[#17a2b8]" : "bg-white/20"}`} />
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm text-white/60">Active (visible on shop page)</span>
        </label>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ef3825] text-white font-semibold text-sm hover:bg-[#d42f1d] disabled:opacity-60 transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? "Uploading…" : "Create Product"}
          </button>
          <Link href="/admin/products" className="text-sm text-white/40 hover:text-white transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
