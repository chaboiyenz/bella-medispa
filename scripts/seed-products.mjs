/**
 * Bella MediSpa 2.0 — Product Seed Diagnostic
 * "Materialising product inventory into the Anti-Gravity platform."
 *
 * Usage:   pnpm seed:products
 *          (Node 20+ loads .env.local automatically via --env-file)
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY (The Master Key).
 *           The anon key is restricted by RLS and cannot write.
 */

import { createClient } from "@supabase/supabase-js";

// ── ANSI Clinical Color Palette ───────────────────────────────────────────

const C = {
  cyan:   "\x1b[36m",
  red:    "\x1b[31m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  dim:    "\x1b[2m",
  bold:   "\x1b[1m",
  reset:  "\x1b[0m",
};

const log = {
  info:    (msg) => console.log(`${C.dim}  [seed]${C.reset}  ${msg}`),
  success: (msg) => console.log(`${C.cyan}${C.bold}  [seed]${C.reset}  ${C.cyan}✓ ${msg}${C.reset}`),
  error:   (msg) => console.error(`${C.red}${C.bold}  [seed]${C.reset}  ${C.red}✗ ${msg}${C.reset}`),
  warn:    (msg) => console.warn(`${C.yellow}${C.bold}  [seed]${C.reset}  ${C.yellow}⚠ ${msg}${C.reset}`),
  divider: ()    => console.log(`${C.dim}  ${"─".repeat(52)}${C.reset}`),
};

// ── Credential Validation — The Master Key Check ──────────────────────────

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const ANON_KEY         = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

function validateCredentials() {
  if (!SUPABASE_URL) {
    log.error("NEXT_PUBLIC_SUPABASE_URL is not set — check .env.local.");
    process.exit(1);
  }

  if (!SERVICE_ROLE_KEY) {
    log.error(
      "SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
      "        The anon key is blocked by RLS and cannot seed the database.\n" +
      "        Obtain it from: Supabase Dashboard → Settings → API → service_role."
    );
    process.exit(1);
  }

  // Guard against accidentally using the anon key as the service role key
  if (SERVICE_ROLE_KEY === ANON_KEY) {
    log.error(
      "SUPABASE_SERVICE_ROLE_KEY is identical to NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "        You are using the wrong key. The service_role key has a different value."
    );
    process.exit(1);
  }
}

// ── Cloud vs. Local Detection ─────────────────────────────────────────────

function detectEnvironment(url) {
  if (url.includes("localhost") || url.includes("127.0.0.1") || url.includes(":54321")) {
    return "local";
  }
  if (/https:\/\/[a-z]+\.supabase\.co/.test(url)) {
    return "cloud";
  }
  return "unknown";
}

// ── Product Inventory ─────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name:        "Bella Signature Serum",
    description: "Our proprietary blend of hyaluronic acid, peptides, and vitamin C for all-day hydration and radiance. Medical-grade formula.",
    price:       89,
    stock:       50,
    category:    "skincare",
    is_active:   true,
  },
  {
    name:        "Post-Treatment Recovery Kit",
    description: "Everything you need for optimal recovery: gentle cleanser, barrier cream, SPF 50, and healing serum — curated by our estheticians.",
    price:       149,
    stock:       30,
    category:    "kits",
    is_active:   true,
  },
  {
    name:        "Medical-Grade SPF 50+",
    description: "Broad-spectrum mineral sunscreen with tinted finish. Non-comedogenic, reef-safe, and essential after any laser or injectable treatment.",
    price:       55,
    stock:       75,
    category:    "skincare",
    is_active:   true,
  },
  {
    name:        "Diamond Glow Infusion Serum",
    description: "The same professional serum used in our Diamond Glow facials. Packed with growth factors and antioxidants for at-home maintenance.",
    price:       129,
    stock:       40,
    category:    "skincare",
    is_active:   true,
  },
  {
    name:        "HydraFacial Recovery Mask",
    description: "Calming sheet mask infused with ceramides and niacinamide. Use immediately post-treatment for accelerated healing and reduced redness.",
    price:       38,
    stock:       100,
    category:    "masks",
    is_active:   true,
  },
  {
    name:        "Vitamin C Brightening Cream",
    description: "20% L-ascorbic acid with ferulic acid for maximum stability. Fades dark spots and boosts collagen for a visibly brighter complexion.",
    price:       75,
    stock:       60,
    category:    "skincare",
    is_active:   true,
  },
  {
    name:        "Retinol Night Renewal Serum",
    description: "Encapsulated 0.5% retinol for nightly skin renewal without irritation. Pairs perfectly with our HALO™ Laser aftercare protocol.",
    price:       95,
    stock:       45,
    category:    "skincare",
    is_active:   true,
  },
  {
    name:        "LATISSE® Eyelash Serum",
    description: "FDA-approved bimatoprost solution for fuller, longer, darker lashes. Prescription-strength, dispensed by our medical team.",
    price:       180,
    stock:       25,
    category:    "prescriptions",
    is_active:   true,
  },
];

// ── RLS Fix SQL ───────────────────────────────────────────────────────────

function printRlsFix() {
  console.log(`
${C.bold}  Post-Seed Security — Enable Read Access for Everyone${C.reset}
${C.dim}  Run in Supabase SQL Editor → New Query if products are invisible on the frontend:${C.reset}

${C.cyan}  ALTER TABLE products ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "products: public read active" ON products;

  CREATE POLICY "products: public read active"
    ON products FOR SELECT
    USING (is_active = TRUE);${C.reset}
`);
}

// ── Main Diagnostic ───────────────────────────────────────────────────────

async function seed() {
  console.log(`\n${C.bold}  Bella MediSpa 2.0 — Product Seed Diagnostic${C.reset}`);
  log.divider();

  // 1. Credential validation
  validateCredentials();

  // 2. Environment detection
  const env = detectEnvironment(SUPABASE_URL);
  log.info(`URL:    ${C.dim}${SUPABASE_URL}${C.reset}`);
  log.info(`Target: ${env === "cloud" ? C.cyan : C.yellow}${env}${C.reset}`);
  log.info(`Auth:   ${C.dim}service_role key (RLS bypassed)${C.reset}`);

  if (env === "local") {
    log.warn("Targeting LOCAL Supabase — ensure 'supabase start' is running.");
  }
  if (env === "unknown") {
    log.warn("Unrecognised Supabase URL — proceeding with caution.");
  }

  log.divider();

  // 3. Create admin client — auth.persistSession:false prevents environment contamination
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      persistSession:   false,
      autoRefreshToken: false,
    },
  });

  // 4. Verify the products table exists
  log.info("Verifying products table…");
  const { count: existingCount, error: tableError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (tableError) {
    if (tableError.code === "42P01" || tableError.message.includes("does not exist")) {
      log.error(
        `Clinical Clog — Table 'products' does not exist.\n` +
        `          → Run ${C.bold}supabase/migrations/003_shop.sql${C.red} in the Supabase SQL Editor first.`
      );
    } else if (
      tableError.code === "PGRST301" ||
      tableError.message.toLowerCase().includes("jwt") ||
      tableError.message.toLowerCase().includes("invalid api key")
    ) {
      log.error(
        `Clinical Clog — Authentication rejected (RLS or invalid key).\n` +
        `          → Verify SUPABASE_SERVICE_ROLE_KEY in Dashboard → Settings → API.`
      );
    } else if (tableError.message.toLowerCase().includes("network") || tableError.message.toLowerCase().includes("fetch")) {
      log.error(
        `Clinical Clog — Network timeout. Cannot reach ${SUPABASE_URL}.\n` +
        `          → Check your internet connection and Supabase project status.`
      );
    } else {
      log.error(`Clinical Clog — ${tableError.message} (code: ${tableError.code ?? "unknown"})`);
    }
    process.exit(1);
  }

  log.success(`products table confirmed. Current row count: ${C.bold}${existingCount ?? 0}${C.reset}`);

  // 5. Fetch existing product names to avoid duplicates (no UNIQUE constraint on name)
  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("name");

  if (fetchError) {
    log.error(`Failed to fetch existing products: ${fetchError.message}`);
    process.exit(1);
  }

  const existingNames = new Set((existing ?? []).map((p) => p.name));
  const toInsert = PRODUCTS.filter((p) => !existingNames.has(p.name));

  if (toInsert.length === 0) {
    log.success(`All ${PRODUCTS.length} products are already materialised. No action required.`);
    log.divider();
    printRlsFix();
    return;
  }

  log.info(`Inserting ${toInsert.length} new product(s) (${existingNames.size} already exist)…`);

  // 6. Insert missing products
  const { error: insertError } = await supabase.from("products").insert(toInsert);

  if (insertError) {
    log.error(`Clinical Clog — Insert failed: ${insertError.message}`);
    if (insertError.code === "42501") {
      log.error("Permission denied. Your service_role key may not have insert rights on this table.");
    }
    process.exit(1);
  }

  // 7. Clinical Confirmation — verify final count
  const { count: finalCount, error: confirmError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (confirmError) {
    log.error(`Clinical Confirmation failed: ${confirmError.message}`);
    process.exit(1);
  }

  if (!finalCount || finalCount === 0) {
    log.error(
      `Clinical Clog — Insert reported success but the table is still empty.\n` +
      `          → This is an RLS issue. Run the SQL fix below.`
    );
    printRlsFix();
    process.exit(1);
  }

  // 8. Success
  log.divider();
  log.success(
    `${finalCount} product(s) materialised in the Anti-Gravity platform.`
  );
  log.info(`Shop:   ${C.dim}http://localhost:3000/shop${C.reset}`);
  log.divider();
  printRlsFix();
}

// ── Run ───────────────────────────────────────────────────────────────────

seed().catch((err) => {
  console.error(`\n${C.red}${C.bold}  Unhandled seed error:${C.reset} ${err.message}\n`);
  process.exit(1);
});
