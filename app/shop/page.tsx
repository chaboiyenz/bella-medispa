import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { getActiveProducts } from "@/lib/actions/products";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Medical-grade skincare and treatment essentials curated by the Bella MediSpa team.",
};

const CATEGORY_ORDER = ["skincare", "kits", "masks", "prescriptions"];

function groupByCategory(products: Product[]) {
  const map: Record<string, Product[]> = {};
  for (const p of products) {
    const cat = p.category ?? "other";
    (map[cat] ??= []).push(p);
  }
  return map;
}

const CATEGORY_LABELS: Record<string, string> = {
  skincare:      "Skincare",
  kits:          "Treatment Kits",
  masks:         "Masks & Recovery",
  prescriptions: "Prescription Products",
  other:         "Other",
};

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = await getActiveProducts();
  } catch {
    // Supabase not yet configured
  }

  const grouped = groupByCategory(products);
  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="min-h-screen mesh-bg text-[#0F172A] pt-16">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8]">
            <span className="w-6 h-px bg-[#17a2b8]" />
            Medical-Grade Essentials
            <span className="w-6 h-px bg-[#17a2b8]" />
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light mt-3 text-[#0F172A]">
            The <span className="text-[#ef3825] italic">Bella Shop</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-3 max-w-md mx-auto leading-relaxed">
            Clinician-approved products for between-treatment care and
            lasting results.
          </p>
        </div>

        {products.length === 0 ? (
          /* Empty state — Supabase not yet seeded */
          <div className="text-center py-24">
            <div className="glass inline-flex flex-col items-center gap-4 rounded-3xl p-12 border border-white/30">
              <p className="text-[#64748B] text-sm">
                Products coming soon — seed the database to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {categories.map((cat) => (
              <section key={cat}>
                <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-[#17a2b8] mb-6 flex items-center gap-3">
                  <span className="w-6 h-px bg-[#17a2b8]" />
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {grouped[cat].map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
