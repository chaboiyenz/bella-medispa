"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAdminMode } from "@/lib/context/AdminModeContext";
import { deleteProduct } from "@/lib/actions/admin";
import { ProductCRUDModal } from "@/components/admin/ProductCRUDModal";
import type { Product } from "@/types";

// ── Private Inquiry modal ─────────────────────────────────────────────────────

function InquireModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open:    boolean;
  onClose: () => void;
}) {
  const [name, setName]           = useState("");
  const [contact, setContact]     = useState("");
  const [message, setMessage]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setLoading(true);
    // Simulated async — swap for a real server action when ready
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  }

  function handleClose() {
    setName(""); setContact(""); setMessage("");
    setSubmitted(false);
    onClose();
  }

  const FIELD =
    "w-full bg-transparent border-0 border-b border-slate-200 pb-2.5 text-sm " +
    "text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#0F172A] " +
    "transition-colors duration-200 disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-white max-w-sm p-0 border-0 shadow-2xl rounded-none overflow-hidden">
        {/* Accessible label — always present; visually hidden so the archival header shows instead */}
        <DialogTitle className="sr-only">Private Inquiry: {product.name}</DialogTitle>

        {submitted ? (
          /* ── Archive confirmation ── */
          <div className="px-10 py-16 flex flex-col items-center gap-6 text-center">
            <span className="w-11 h-11 rounded-full border border-[#17a2b8]/25 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#17a2b8]" />
            </span>
            <div>
              <p className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase mb-3">
                Inquiry Received
              </p>
              <p className="font-serif text-xl font-bold italic text-[#0F172A]">
                We Will Be in Touch
              </p>
              <p className="text-[11px] text-[#64748B] mt-3 max-w-[26ch] leading-relaxed mx-auto">
                Our team will respond within 24 hours to arrange collection at our
                Dover, DE studio.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[9px] tracking-[0.4em] font-bold text-[#94A3B8] uppercase hover:text-[#0F172A] transition-colors"
            >
              CLOSE ARCHIVE
            </button>
          </div>
        ) : (
          <>
            {/* Exhibit header */}
            <div className="px-10 pt-10 pb-6 border-b border-slate-100">
              <p className="text-[9px] tracking-[0.4em] font-bold text-[#94A3B8] uppercase mb-1.5">
                Private Inquiry
              </p>
              <p className="font-serif text-xl font-bold italic text-[#0F172A] leading-tight">
                Request Access<br />to Archive
              </p>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="px-10 py-8 flex flex-col gap-6">
              <p className="text-[11px] text-[#94A3B8] leading-relaxed -mt-2">
                Complete the form to request{" "}
                <span className="italic text-[#0F172A]">{product.name}</span>.
                Our team will contact you to arrange collection in Dover, DE.
              </p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                required
                disabled={loading}
                className={FIELD}
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone or email *"
                required
                disabled={loading}
                className={FIELD}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Preferred date or questions… (optional)"
                rows={2}
                disabled={loading}
                className={`${FIELD} resize-none`}
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !contact.trim()}
                  className="flex items-center gap-2 text-[9px] tracking-[0.4em] font-bold text-[#0F172A] uppercase hover:text-[#17a2b8] disabled:opacity-40 transition-colors"
                >
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {loading ? "TRANSMITTING…" : "SUBMIT INQUIRY"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[9px] tracking-[0.4em] font-bold text-[#CBD5E1] uppercase hover:text-[#0F172A] transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}

// ── Exhibit Card ──────────────────────────────────────────────────────────────

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { isAdmin }                   = useAdminMode();
  const router                        = useRouter();
  const [, startTransition]           = useTransition();
  const [inquireOpen, setInquireOpen] = useState(false);
  const [editOpen, setEditOpen]       = useState(false);
  const [deleting, setDeleting]       = useState(false);


  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProduct(product.id);
      startTransition(() => router.refresh());
    } finally {
      setDeleting(false);
    }
  }

  const categoryLabel = (product.category ?? "GENERAL").toUpperCase().replace(/\s+/g, " / ");

  return (
    <>
      {/* ── Boutique exhibit card: white panel, large image, Cyan tag, Navy Playfair title, Clinical Details CTA ── */}
      <div
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-2xl shadow-slate-300/40 transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
        suppressHydrationWarning
      >

        {/* Cyan (#17a2b8) category tag */}
        <div className="px-6 pt-5 pb-3" suppressHydrationWarning>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
            {categoryLabel}
          </span>
        </div>

        {/* Large product image — shielded for extension-injected attributes */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white" suppressHydrationWarning>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50" suppressHydrationWarning>
              <span className="text-[9px] tracking-[0.4em] text-[#E2E8F0] uppercase font-bold">
                No Image
              </span>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10" suppressHydrationWarning>
              <button
                onClick={() => setEditOpen(true)}
                title="Edit product"
                className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center text-[#94A3B8] hover:text-[#17a2b8] transition-all"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete product"
                className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center text-[#94A3B8] hover:text-[#ef3825] disabled:opacity-50 transition-all"
              >
                {deleting
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Trash2 className="w-3 h-3" />
                }
              </button>
            </div>
          )}
        </div>

        {/* Navy (#0F172A) Playfair Display title + description */}
        <div className="px-6 py-5 flex flex-col gap-3 flex-1" suppressHydrationWarning>

          <h3 className="font-serif text-xl font-bold text-[#0F172A] leading-snug">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="h-px bg-slate-100 mt-2" />

          {/* Primary Red (#ef3825) Clinical Details — opens inquiry modal */}
          <button
            onClick={() => setInquireOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#ef3825] hover:bg-[#d42f1d] text-white text-sm font-semibold transition-colors duration-300 shadow-sm mt-2"
          >
            Clinical Details
          </button>

        </div>
      </div>

      {/* ── Inquiry modal ── */}
      <InquireModal
        product={product}
        open={inquireOpen}
        onClose={() => setInquireOpen(false)}
      />

      {/* ── Admin edit modal ── */}
      {isAdmin && (
        <ProductCRUDModal
          mode="edit"
          product={product}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
