/**
 * Playwright E2E tests — Admin Team CRUD
 *
 * Prerequisites:
 *   1. A seeded Supabase instance with the 009_team.sql migration applied.
 *   2. env vars PLAYWRIGHT_ADMIN_EMAIL + PLAYWRIGHT_ADMIN_PASSWORD set.
 *   3. `pnpm dev` running (or CI handles the webServer config in playwright.config.ts).
 *
 * Run:  pnpm exec playwright test tests/admin/team-crud.spec.ts
 */

import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL    = process.env.PLAYWRIGHT_ADMIN_EMAIL    ?? "admin@bellamedispa.com";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "admin-password-here";

// ── Helper: sign in as admin ──────────────────────────────────────────────

async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  // Wait for redirect away from login
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });
}

// ── Test 1: Admin can add a new team member ───────────────────────────────

test("Should allow admin to add a new team member and see it materialise in the grid", async ({
  page,
}) => {
  await signInAsAdmin(page);
  await page.goto("/team");

  // Admin bar should be visible
  await expect(page.getByText("Admin Mode — Team")).toBeVisible();

  // Open create modal
  await page.getByRole("button", { name: /add specialist/i }).click();

  // Dialog must have an accessible title
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: /add specialist/i })).toBeVisible();

  // Fill form
  const uniqueName = `Test Specialist ${Date.now()}`;
  await page.getByPlaceholder(/full name/i).fill(uniqueName);
  await page.getByPlaceholder(/professional title/i).fill("Test Role — E2E");
  await page.getByPlaceholder(/credentials/i).fill("MA");
  await page.getByPlaceholder(/bio/i).fill("Created by Playwright E2E test.");

  // Submit
  await page.getByRole("button", { name: /add specialist/i }).click();

  // Modal closes and the new card materialises in the grid
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10_000 });
});

// ── Test 2: Admin can update an existing member's role ───────────────────

test("Should allow admin to update an existing member's role", async ({
  page,
}) => {
  await signInAsAdmin(page);
  await page.goto("/team");

  // Hover over the first card to reveal the edit button
  const firstCard = page.locator("article").first();
  await firstCard.hover();

  const editBtn = firstCard.locator('button[title="Edit specialist"]');
  await expect(editBtn).toBeVisible({ timeout: 5_000 });
  await editBtn.click();

  // Dialog with 'Edit Specialist' title
  await expect(page.getByRole("heading", { name: /edit specialist/i })).toBeVisible();

  // Update the role field
  const newRole = `Updated Role ${Date.now()}`;
  const roleInput = page.getByPlaceholder(/professional title/i);
  await roleInput.clear();
  await roleInput.fill(newRole);

  await page.getByRole("button", { name: /save changes/i }).click();

  // Modal closes and updated role appears
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(newRole)).toBeVisible({ timeout: 10_000 });
});

// ── Test 3: Non-admins cannot see or trigger CRUD actions ────────────────

test("Should verify that non-admins cannot see or trigger the CRUD actions", async ({
  page,
}) => {
  // Navigate to team page without signing in (anonymous / non-admin)
  await page.goto("/team");

  // Admin bar must NOT be present
  await expect(page.getByText("Admin Mode — Team")).not.toBeVisible();

  // 'Add Specialist' button must NOT be present
  await expect(
    page.getByRole("button", { name: /add specialist/i })
  ).not.toBeVisible();

  // Hovering a card must NOT reveal edit/delete buttons
  const firstCard = page.locator("article").first();
  if (await firstCard.isVisible()) {
    await firstCard.hover();
    await expect(firstCard.locator('button[title="Edit specialist"]')).not.toBeVisible();
    await expect(firstCard.locator('button[title="Remove specialist"]')).not.toBeVisible();
  }
});
