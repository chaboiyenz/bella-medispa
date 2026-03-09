// Vitest global setup — mock Next.js server-only modules
import { vi } from "vitest";

// Mock next/cache (revalidatePath is a no-op in unit tests)
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock next/headers (cookies() is not available outside the Next.js runtime)
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: () => [],
    set: vi.fn(),
  })),
}));
