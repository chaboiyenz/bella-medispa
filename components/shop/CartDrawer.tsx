"use client";

import { ShoppingBag, Minus, Plus, Trash2, X, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/context/CartContext";

export function CartDrawer() {
  const { items, count, total, update, remove, clear } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={`Cart (${count} items)`}
          className="relative p-2 text-[#64748B] hover:text-[#17a2b8] transition-colors rounded-full hover:bg-white/60"
        >
          <ShoppingBag className="w-4 h-4" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ef3825] text-white text-[9px] font-bold flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[340px] sm:w-[400px] bg-white/95 backdrop-blur-xl border-l border-white/30 p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#17a2b8]" />
            <h2 className="font-serif font-semibold text-[#0F172A]">
              Your Cart
            </h2>
            {count > 0 && (
              <span className="text-xs text-[#64748B]">({count} items)</span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-xs text-[#94a3b8] hover:text-[#ef3825] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#CBD5E1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Your cart is empty</p>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Browse our shop to add products
                </p>
              </div>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9]"
              >
                {/* Image placeholder */}
                <div className="w-14 h-14 rounded-xl bg-white border border-[#F1F5F9] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#CBD5E1]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-[#17a2b8] mt-0.5">
                    ${(Number(product.price) * quantity).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => update(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white border border-[#F1F5F9] flex items-center justify-center hover:border-[#17a2b8] transition-colors"
                    >
                      <Minus className="w-3 h-3 text-[#64748B]" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => update(product.id, quantity + 1)}
                      className="w-6 h-6 rounded-full bg-white border border-[#F1F5F9] flex items-center justify-center hover:border-[#17a2b8] transition-colors"
                    >
                      <Plus className="w-3 h-3 text-[#64748B]" />
                    </button>
                    <button
                      onClick={() => remove(product.id)}
                      className="ml-auto text-[#CBD5E1] hover:text-[#ef3825] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#F1F5F9] flex flex-col gap-3 bg-white/80">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748B]">Subtotal</span>
              <span className="text-lg font-bold text-[#0F172A]">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Shipping & tax calculated at checkout.
            </p>
            <Button
              className="w-full bg-[#ef3825] hover:bg-[#17a2b8] text-white font-semibold rounded-full transition-colors duration-300"
              onClick={() => alert("Stripe checkout coming in next release!")}
            >
              Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
