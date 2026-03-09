"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createService, updateService, deleteService } from "@/lib/actions/admin";
import { ServiceSchema, ServiceFormValues, fieldCls } from "@/lib/validations/admin";
import { Toast } from "@/components/admin/Toast";
import type { Service } from "@/types";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Injectables",
  "Skin Rejuvenation",
  "Body Contouring",
  "Hair Restoration",
  "Wellness",
  "Other",
];

// ── Base input class (dark modal) ─────────────────────────────────────────────
const BASE =
  "w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white " +
  "placeholder:text-white/30 focus:outline-none transition-all duration-150";

export function ServicesManager({ services: initial }: { services: Service[] }) {
  const router                       = useRouter();
  const [modalOpen, setModalOpen]    = useState(false);
  const [editing, setEditing]        = useState<Service | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [toast, setToast]            = useState(false);
  const [deleting, setDeleting]      = useState<string | null>(null);
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    mode:     "onChange",
    defaultValues: {
      name:        "",
      description: "",
      price:       0,
      duration:    60,
      category:    "",
      is_active:   true,
    },
  });

  const isActive = watch("is_active");

  function openCreate() {
    reset({ name: "", description: "", price: 0, duration: 60, category: "", is_active: true });
    setEditing(null);
    setServerError(null);
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    reset({
      name:        s.name,
      description: s.description ?? "",
      price:       s.price,
      duration:    s.duration,
      category:    s.category ?? "",
      is_active:   s.is_active,
    });
    setEditing(s);
    setServerError(null);
    setModalOpen(true);
  }

  function onInvalid() {
    const fields = new Set(Object.keys(errors));
    setShakingFields(fields);
    setTimeout(() => setShakingFields(new Set()), 500);
  }

  const onSubmit = async (values: ServiceFormValues) => {
    setServerError(null);
    const data = {
      name:        values.name.trim(),
      description: values.description?.trim() || null,
      price:       values.price,
      duration:    values.duration,
      category:    values.category?.trim() || null,
      image_url:   null as string | null,
      is_active:   values.is_active,
    };

    try {
      if (editing) {
        await updateService(editing.id, data);
      } else {
        await createService(data);
      }
      setToast(true);
      router.refresh();
      setTimeout(() => setModalOpen(false), 1200);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteService(id);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <Toast show={toast} onClose={() => setToast(false)} />

      {/* Table header action */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white">Services</h1>
          <p className="text-sm text-white/40 mt-1">{initial.length} services</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-[#ef3825] text-white font-semibold hover:bg-[#d42f1d] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      {/* Table */}
      {!initial.length ? (
        <div className="text-center py-24 text-white/30 text-sm">
          No services yet.{" "}
          <button onClick={openCreate} className="text-[#17a2b8] hover:underline">
            Create your first service
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-white/40 uppercase tracking-wide">
                <th className="pb-3 pr-6 font-medium">Service</th>
                <th className="pb-3 pr-6 font-medium">Category</th>
                <th className="pb-3 pr-6 font-medium">Price</th>
                <th className="pb-3 pr-6 font-medium">Duration</th>
                <th className="pb-3 pr-6 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initial.map((s) => (
                <tr key={s.id} className="hover:bg-white/4 transition-colors">
                  <td className="py-4 pr-6">
                    <p className="text-white font-medium">{s.name}</p>
                    {s.description && (
                      <p className="text-white/40 text-xs max-w-xs truncate">{s.description}</p>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-white/60">{s.category ?? "—"}</td>
                  <td className="py-4 pr-6 text-white">${Number(s.price).toFixed(2)}</td>
                  <td className="py-4 pr-6 text-white/60">{s.duration} min</td>
                  <td className="py-4 pr-6">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      s.is_active
                        ? "bg-[#17a2b8]/20 text-[#17a2b8]"
                        : "bg-white/10 text-white/40"
                    }`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/8 text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting === s.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50 transition-colors"
                      >
                        {deleting === s.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Trash2 className="w-3 h-3" />
                        }
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div
            className="relative bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col gap-5"
            suppressHydrationWarning
          >
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-serif text-lg font-semibold text-white">
              {editing ? "Edit Service" : "New Service"}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col gap-4"
              suppressHydrationWarning
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-semibold uppercase tracking-wide">Name *</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Botox"
                  disabled={isSubmitting}
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-semibold uppercase tracking-wide">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Brief description…"
                  rows={2}
                  disabled={isSubmitting}
                  className={`${BASE} resize-none`}
                />
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-wide">Price ($) *</label>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="150.00"
                    disabled={isSubmitting}
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
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-wide">Duration (min) *</label>
                  <input
                    {...register("duration", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    disabled={isSubmitting}
                    className={`${fieldCls(BASE, {
                      error: !!errors.duration,
                      dirty: !!dirtyFields.duration,
                      valid: !errors.duration,
                    })} ${shakingFields.has("duration") ? "animate-shake" : ""}`}
                  />
                  {errors.duration && (
                    <p className="text-[11px] font-semibold text-[#ef3825]">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-semibold uppercase tracking-wide">Category</label>
                <select
                  {...register("category")}
                  disabled={isSubmitting}
                  className={BASE}
                >
                  <option value="">— Select category —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Active */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative shrink-0">
                  <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isActive ? "bg-[#17a2b8]" : "bg-white/20"}`} />
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                  <button
                    type="button"
                    onClick={() => setValue("is_active", !isActive)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Toggle active"
                  />
                </div>
                <span className="text-sm text-white/60">Active (visible on booking page)</span>
              </label>

              {serverError && (
                <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {serverError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ef3825] text-white font-semibold text-sm hover:bg-[#d42f1d] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? "Processing…" : editing ? "Save Changes" : "Create Service"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
