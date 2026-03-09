/**
 * Vitest unit tests — lib/actions/team.ts
 *
 * Tests validation logic and admin-guard without a live Supabase instance.
 * All Supabase I/O is mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Supabase mock factory ─────────────────────────────────────────────────
// Returns a chainable mock that resolves with the provided data/error.

function makeSupabaseMock({
  user = { id: "user-123" },
  role = "admin",
  insertData = null as Record<string, unknown> | null,
  insertError = null as string | null,
}: {
  user?: { id: string } | null;
  role?: string;
  insertData?: Record<string, unknown> | null;
  insertError?: string | null;
} = {}) {
  const single = vi.fn().mockResolvedValue({
    data: insertData ?? { id: "new-id", name: "Test", role: "NP", specializations: [], display_order: 0, is_active: true, created_at: "", updated_at: "" },
    error: insertError ? { message: insertError } : null,
  });
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  const from   = vi.fn((table: string) => {
    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role }, error: null }),
          }),
        }),
      };
    }
    return { insert };
  });

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from,
  };
}

// ── Mock lib/supabase/server ──────────────────────────────────────────────

let mockClient: ReturnType<typeof makeSupabaseMock>;
let mockAdmin: ReturnType<typeof makeSupabaseMock>;

vi.mock("@/lib/supabase/server", () => ({
  createClient:      () => Promise.resolve(mockClient),
  createAdminClient: () => Promise.resolve(mockAdmin),
}));

// ── Import after mocks ────────────────────────────────────────────────────

const { addTeamMember } = await import("@/lib/actions/team");

// ── Tests ─────────────────────────────────────────────────────────────────

describe("addTeamMember — validation", () => {
  beforeEach(() => {
    mockClient = makeSupabaseMock({ role: "admin" });
    mockAdmin  = makeSupabaseMock({ insertData: { id: "new-id", name: "Belle H.", role: "NP Injector", specializations: [], display_order: 0, is_active: true, created_at: "", updated_at: "" } });
  });

  it("should throw if 'name' is missing", async () => {
    await expect(
      addTeamMember({
        name:            "",
        role:            "Aesthetic Nurse Injector",
        credentials:     null,
        license_no:      null,
        bio:             null,
        image_url:       null,
        specializations: [],
        display_order:   0,
        is_active:       true,
      })
    ).rejects.toThrow("Name is required.");
  });

  it("should throw if 'role' is missing", async () => {
    await expect(
      addTeamMember({
        name:            "Belle H.",
        role:            "",
        credentials:     null,
        license_no:      null,
        bio:             null,
        image_url:       null,
        specializations: [],
        display_order:   0,
        is_active:       true,
      })
    ).rejects.toThrow("Role is required.");
  });

  it("should throw if 'name' is whitespace only", async () => {
    await expect(
      addTeamMember({
        name:            "   ",
        role:            "Nurse Injector",
        credentials:     null,
        license_no:      null,
        bio:             null,
        image_url:       null,
        specializations: [],
        display_order:   0,
        is_active:       true,
      })
    ).rejects.toThrow("Name is required.");
  });

  it("should succeed with valid name + role when user is admin", async () => {
    const result = await addTeamMember({
      name:            "Belle H.",
      role:            "Aesthetic Nurse Injector",
      credentials:     "NP-C",
      license_no:      null,
      bio:             null,
      image_url:       null,
      specializations: ["BOTOX®", "Dermal Fillers"],
      display_order:   0,
      is_active:       true,
    });
    expect(result).toBeDefined();
    expect(result.id).toBe("new-id");
  });
});

describe("addTeamMember — authorization", () => {
  it("should throw 'Unauthorized' when no user is signed in", async () => {
    mockClient = makeSupabaseMock({ user: null });
    mockAdmin  = makeSupabaseMock();

    await expect(
      addTeamMember({
        name:            "Belle H.",
        role:            "Nurse Injector",
        credentials:     null,
        license_no:      null,
        bio:             null,
        image_url:       null,
        specializations: [],
        display_order:   0,
        is_active:       true,
      })
    ).rejects.toThrow("Unauthorized");
  });

  it("should throw 'Forbidden' when signed-in user is not admin", async () => {
    mockClient = makeSupabaseMock({ user: { id: "client-user" }, role: "client" });
    mockAdmin  = makeSupabaseMock();

    await expect(
      addTeamMember({
        name:            "Belle H.",
        role:            "Nurse Injector",
        credentials:     null,
        license_no:      null,
        bio:             null,
        image_url:       null,
        specializations: [],
        display_order:   0,
        is_active:       true,
      })
    ).rejects.toThrow("Forbidden");
  });
});
