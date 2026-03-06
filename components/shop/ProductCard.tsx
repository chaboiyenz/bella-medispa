"use client";

import Image from "next/image";
import { ShoppingBag, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/context/CartContext";
import type { Product } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  skincare:      "Skincare",
  kits:          "Treatment Kits",
  masks:         "Masks",
  prescriptions: "Rx",
};

export function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <Card className="group glass border border-white/30 rounded-3xl p-2 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-[#17a2b8]/10 transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-2xl relative bg-[#F8FAFC]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-[#CBD5E1]" />
          </div>
        )}
        {/* Category pill */}
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#64748B]">
          {CATEGORY_LABELS[product.category ?? ""] ?? product.category}
        </span>
        {inCart && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#17a2b8] text-white">
            {inCart.quantity} in cart
          </span>
        )}
      </div>

      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-[#0F172A] text-sm leading-snug">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#0F172A]">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-xs text-[#94a3b8]">
            {product.stock} left
          </span>
        </div>

        <Button
          onClick={() => add(product)}
          className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold transition-colors duration-300 rounded-xl shadow-sm shadow-[#ef3825]/20 hover:shadow-[#17a2b8]/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
