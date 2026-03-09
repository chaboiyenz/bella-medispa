"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useAdminMode } from "@/lib/context/AdminModeContext";
import { deleteTeamMember } from "@/lib/actions/team";
import { TeamMemberModal } from "@/components/admin/TeamMemberModal";
import type { TeamMember } from "@/types";

/**
 * Thin client wrapper around a team card that materialises Edit/Delete
 * controls when isAdmin is active. Rendered by the Server Component
 * team page using `group/admin` so hover states don't bleed.
 */
export function TeamCardAdmin({ member }: { member: TeamMember }) {
  const { isAdmin }              = useAdminMode();
  const router                   = useRouter();
  const [, startTransition]      = useTransition();
  const [editOpen, setEditOpen]  = useState(false);
  const [deleting, setDeleting]  = useState(false);

  if (!isAdmin) return null;

  async function handleDelete() {
    if (!confirm(`Remove "${member.name}" from the team? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteTeamMember(member.id);
      startTransition(() => router.refresh());
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Hover overlay — only visible when parent has group/admin hover; suppressHydrationWarning for extension-injected attributes */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover/admin:opacity-100 transition-opacity duration-150" suppressHydrationWarning>
        <button
          onClick={() => setEditOpen(true)}
          title="Edit specialist"
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#64748B] hover:text-[#17a2b8] hover:shadow-lg transition-all duration-150"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Remove specialist"
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#64748B] hover:text-[#ef3825] hover:shadow-lg disabled:opacity-50 transition-all duration-150"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit modal — portal-mounted, never clipped by card overflow */}
      <TeamMemberModal
        mode="edit"
        member={member}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
