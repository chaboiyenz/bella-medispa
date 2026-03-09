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

export default async function ShopPage() {
  const { products, error } = await getActiveProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] pt-16" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-24" suppressHydrationWarning>

        {/* Exhibition masthead — shielded from extension scanning */}
        <div className="mb-20" suppressHydrationWarning>
          <div className="flex items-center gap-4 mb-8" suppressHydrationWarning>
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
          <div className="py-24 border border-dashed border-slate-200" suppressHydrationWarning>
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
          <div className="py-24 border border-dashed border-slate-200 text-center" suppressHydrationWarning>
            <p className="text-[9px] tracking-[0.4em] font-bold text-[#CBD5E1] uppercase">
              Collection in Preparation
            </p>
          </div>
        ) : (
          /* Asymmetrical 2-column gallery — staggered flow */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12" suppressHydrationWarning>
            {products.map((p, idx) => (
              <div
                key={p.id}
                className={idx % 2 === 1 ? "sm:pt-16" : idx % 3 === 2 ? "sm:pt-8" : ""}
                suppressHydrationWarning
              >
                <ProductCard product={p} index={idx} />
              </div>
            ))}
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="flex items-center gap-6 pt-16 mt-16 border-t border-slate-200" suppressHydrationWarning>
            <span className="text-[9px] tracking-[0.45em] font-bold text-[#E2E8F0] uppercase">
              End of Archive
            </span>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[9px] tracking-[0.45em] font-bold text-[#E2E8F0] uppercase">
              Bella MediSpa
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
