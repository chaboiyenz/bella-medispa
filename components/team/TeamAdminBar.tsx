"use client";

import { useState } from "react";
import { Plus, Shield } from "lucide-react";
import { useAdminMode } from "@/lib/context/AdminModeContext";
import { TeamMemberModal } from "@/components/admin/TeamMemberModal";

/**
 * Amber admin bar shown at the top of /team when isAdmin is true.
 * Provides the "Add Specialist" button to open the create modal.
 */
export function TeamAdminBar() {
  const { isAdmin } = useAdminMode();
  const [createOpen, setCreateOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="flex items-center justify-between px-5 py-3 mb-10 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-bold text-amber-700 tracking-[0.15em] uppercase">
            Admin Mode — Team
          </span>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#ef3825] text-white hover:bg-[#17a2b8] transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Specialist
        </button>
      </div>

      <TeamMemberModal
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
