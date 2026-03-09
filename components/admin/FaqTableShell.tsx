"use client";

import { useState, useRef, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Search, ChevronLeft, ChevronRight, Flame,
  Trash2, Loader2, X, FolderOpen,
} from "lucide-react";
import { FaqCRUDModal } from "@/components/admin/FaqCRUDModal";
import { deleteFaq, deleteFaqsBulk, updateFaqsCategory } from "@/lib/actions/faqs";
import type { Faq } from "@/types";

export const CATEGORIES = [
  "Pricing", "Treatments", "Booking", "Recovery",
  "Safety", "Policies", "General",
];

// ── Indeterminate checkbox ────────────────────────────────────────────────────
function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="w-3.5 h-3.5 accent-[#17a2b8] cursor-pointer rounded"
      {...rest}
    />
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
      active ? "bg-[#17a2b8]/15 text-[#17a2b8]" : "bg-white/8 text-white/30"
    }`}>
      {active ? "Active" : "Draft"}
    </span>
  );
}

// ── Per-row delete button ─────────────────────────────────────────────────────
function DeleteRowButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteFaq(id);
          router.refresh();
        })
      }
      className="text-xs px-2.5 py-1.5 rounded-lg bg-[#ef3825]/15 text-[#ef3825] hover:bg-[#ef3825]/25 transition-colors disabled:opacity-40 flex items-center gap-1"
    >
      {pending ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Trash2 className="w-3 h-3" />
      )}
    </button>
  );
}

// ── Column helper (module-level) ──────────────────────────────────────────────
const columnHelper = createColumnHelper<Faq>();

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  faqs: Faq[];
  total: number;
  page: number;
  pageSize: number;
  initialQ: string;
  initialCategory: string;
  initialSort: string;
}

export function FaqTableShell({
  faqs, total, page, pageSize, initialQ, initialCategory, initialSort,
}: Props) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const [rowSelection,    setRowSelection]    = useState<RowSelectionState>({});
  const [searchInput,     setSearchInput]     = useState(initialQ);
  const [bulkCategory,    setBulkCategory]    = useState("");
  const [isBulkPending,   startBulkTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const totalPages  = Math.ceil(total / pageSize);
  const selectedIds = Object.keys(rowSelection);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const pushParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    router.push(`/admin/faqs?${p.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParam("q", value), 300);
  };

  // ── Bulk actions ───────────────────────────────────────────────────────────
  const handleBulkDelete = () => {
    startBulkTransition(async () => {
      await deleteFaqsBulk(selectedIds);
      setRowSelection({});
      router.refresh();
    });
  };

  const handleBulkCategory = (cat: string) => {
    if (!cat) return;
    startBulkTransition(async () => {
      await updateFaqsCategory(selectedIds, cat);
      setRowSelection({});
      setBulkCategory("");
      router.refresh();
    });
  };

  // ── Column definitions ─────────────────────────────────────────────────────
  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      size: 40,
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      size: 80,
      cell: ({ getValue }) => <StatusBadge active={getValue()} />,
    }),
    columnHelper.accessor("question", {
      header: "Question",
      cell: ({ getValue, row }) => (
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate max-w-[280px]">
            {getValue()}
          </p>
          <p className="text-[11px] text-white/30 truncate max-w-[280px] mt-0.5">
            {row.original.answer}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      size: 120,
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/60">
            {getValue()}
          </span>
        ) : (
          <span className="text-white/20 text-xs">—</span>
        ),
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated",
      size: 110,
      cell: ({ getValue }) => (
        <span className="text-xs text-white/40">
          {new Date(getValue()).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </span>
      ),
    }),
    columnHelper.accessor("usage_count", {
      header: () => (
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3" /> Asks
        </span>
      ),
      size: 70,
      cell: ({ getValue }) => (
        <span className={`text-xs font-medium ${
          getValue() > 0 ? "text-[#17a2b8]" : "text-white/20"
        }`}>
          {getValue() > 0 ? getValue() : "—"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      size: 110,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <FaqCRUDModal faq={row.original} />
          <DeleteRowButton id={row.original.id} />
        </div>
      ),
    }),
  ], []);

  // ── TanStack Table ─────────────────────────────────────────────────────────
  const table = useReactTable({
    data: faqs,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  return (
    <div>
      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-6"
        suppressHydrationWarning
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search questions & answers…"
            className="w-full bg-white/6 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#17a2b8] focus:border-[#17a2b8] transition-all"
          />
        </div>

        {/* Category facet */}
        <select
          value={initialCategory}
          onChange={(e) => pushParam("category", e.target.value)}
          className="bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-[#17a2b8] transition-all appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Most Asked sort toggle */}
        <button
          onClick={() => pushParam("sort", initialSort === "most_asked" ? "" : "most_asked")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
            initialSort === "most_asked"
              ? "bg-[#17a2b8]/15 border-[#17a2b8]/40 text-[#17a2b8]"
              : "bg-white/6 border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <Flame className="w-4 h-4" />
          Most Asked
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-white/30">
          <FolderOpen className="w-9 h-9" />
          <p className="text-sm">No FAQs match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-white/10 bg-white/4">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className="text-left text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 px-4 py-3 first:pl-5"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-white/4 transition-colors ${
                    row.getIsSelected() ? "bg-[#17a2b8]/6 hover:bg-[#17a2b8]/8" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 align-middle first:pl-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-white/30">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", String(page - 1));
                router.push(`/admin/faqs?${p.toString()}`);
              }}
              className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-white/40 px-2">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", String(page + 1));
                router.push(`/admin/faqs?${p.toString()}`);
              }}
              className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 text-white/60 hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk action bar ──────────────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#0F172A] border border-white/20 rounded-2xl px-5 py-3 shadow-2xl shadow-black/50">
          <span className="text-sm font-medium text-white">
            {selectedIds.length} selected
          </span>
          <div className="h-4 w-px bg-white/20" />

          {/* Change category */}
          <select
            value={bulkCategory}
            onChange={(e) => { setBulkCategory(e.target.value); handleBulkCategory(e.target.value); }}
            disabled={isBulkPending}
            className="bg-white/8 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#17a2b8] appearance-none cursor-pointer"
          >
            <option value="">Change category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Delete selected */}
          <button
            onClick={handleBulkDelete}
            disabled={isBulkPending}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#ef3825]/20 text-[#ef3825] hover:bg-[#ef3825]/30 transition-colors disabled:opacity-40"
          >
            {isBulkPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Delete Selected
          </button>

          {/* Dismiss */}
          <button
            onClick={() => setRowSelection({})}
            className="text-white/30 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
