import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopAdminBar } from "@/components/admin/ShopAdminBar";
import { getActiveProducts } from "@/lib/actions/products";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Boutique",
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
  skincare:      "SKINCARE",
  kits:          "TREATMENT KITS",
  masks:         "MASKS & RECOVERY",
  prescriptions: "PRESCRIPTION",
  other:         "GENERAL",
};

export default async function ShopPage() {
  const { products, error } = await getActiveProducts();

  const grouped = groupByCategory(products);
  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  let globalIdx = 0;

  return (
    <div className="min-h-screen bg-white text-[#0F172A] pt-16">
      <div className="max-w-5xl mx-auto px-8 py-24">

        {/* Exhibition masthead */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-10 h-px bg-slate-200" />
            <span className="text-[9px] tracking-[0.45em] font-bold text-[#94A3B8] uppercase">
              Dover, Delaware · Est. 2024
            </span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold italic text-[#0F172A] leading-[0.9] mb-6">
            The<br />Archive
          </h1>
          <p className="text-[10px] tracking-[0.25em] font-medium text-[#94A3B8] uppercase max-w-[22ch] leading-[2]">
            Medical-grade essentials selected for clinical efficacy and lasting results.
          </p>
        </div>

        <ShopAdminBar />

        {error ? (
          <div className="py-24 border border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[9px] tracking-[0.4em] font-bold text-red-400 uppercase">
                Archive Unavailable
              </p>
              {process.env.NODE_ENV !== "production" && (
                <p className="font-mono text-xs text-red-400 max-w-lg break-all text-center">
                  {error}
                </p>
              )}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 border border-dashed border-slate-200 text-center">
            <p className="text-[9px] tracking-[0.4em] font-bold text-[#CBD5E1] uppercase">
              Collection in Preparation
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {categories.map((cat) => (
              <section key={cat}>

                {/* Exhibition room label */}
                <div className="flex items-center gap-6 mb-12">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[9px] tracking-[0.5em] font-bold text-[#CBD5E1] uppercase">
                    {CATEGORY_LABELS[cat] ?? cat.toUpperCase()}
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Exhibit panels — 2-column gallery wall */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100">
                  {grouped[cat].map((p) => {
                    const idx = globalIdx++;
                    return <ProductCard key={p.id} product={p} index={idx} />;
                  })}
                </div>

              </section>
            ))}

            {/* Archive colophon */}
            <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
              <span className="text-[9px] tracking-[0.45em] font-bold text-[#E2E8F0] uppercase">
                End of Archive
              </span>
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[9px] tracking-[0.45em] font-bold text-[#E2E8F0] uppercase">
                Bella MediSpa
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
