import { createAdminClient } from "@/lib/supabase/server";
import { toggleProductActive, updateProduct, deleteProduct } from "@/lib/actions/admin";
import Link from "next/link";

export default async function AdminProductsPage() {
  const supabase = await createAdminClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div className="p-8" suppressHydrationWarning>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white">
            Products
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {products?.length ?? 0} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="text-sm px-4 py-2 rounded-xl bg-[#ef3825] text-white font-semibold hover:bg-[#d42f1d] transition-colors"
        >
          + New Product
        </Link>
      </div>

      {!products?.length ? (
        <div className="text-center py-24 text-white/30 text-sm">
          No products yet.{" "}
          <Link href="/admin/products/new" className="text-[#17a2b8] hover:underline">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto" suppressHydrationWarning>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-white/40 uppercase tracking-wide">
                <th className="pb-3 pr-6 font-medium">Product</th>
                <th className="pb-3 pr-6 font-medium">Category</th>
                <th className="pb-3 pr-6 font-medium">Price</th>
                <th className="pb-3 pr-6 font-medium">Stock</th>
                <th className="pb-3 pr-6 font-medium">Active</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/4 transition-colors">
                  <td className="py-4 pr-6">
                    <p className="text-white font-medium">{p.name}</p>
                    {p.description && (
                      <p className="text-white/40 text-xs max-w-xs truncate">{p.description}</p>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-white/60">{p.category}</td>

                  {/* Inline price edit */}
                  <td className="py-4 pr-6">
                    <form action={async (fd: FormData) => {
                      "use server";
                      const price = parseFloat(fd.get("price") as string);
                      if (!isNaN(price)) await updateProduct(p.id, { price });
                    }} className="flex items-center gap-1">
                      <span className="text-white/40">$</span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={Number(p.price).toFixed(2)}
                        className="w-20 bg-white/8 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-[#17a2b8]"
                      />
                      <button type="submit" className="text-xs px-2 py-1 rounded-lg bg-white/8 hover:bg-white/15 text-white/60 transition-colors">
                        Save
                      </button>
                    </form>
                  </td>

                  {/* Inline stock edit */}
                  <td className="py-4 pr-6">
                    <form action={async (fd: FormData) => {
                      "use server";
                      const stock = parseInt(fd.get("stock") as string, 10);
                      if (!isNaN(stock)) await updateProduct(p.id, { stock });
                    }} className="flex items-center gap-1">
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        defaultValue={p.stock}
                        className="w-16 bg-white/8 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-[#17a2b8]"
                      />
                      <button type="submit" className="text-xs px-2 py-1 rounded-lg bg-white/8 hover:bg-white/15 text-white/60 transition-colors">
                        Save
                      </button>
                    </form>
                  </td>

                  {/* Toggle active */}
                  <td className="py-4 pr-6">
                    <form action={async () => {
                      "use server";
                      await toggleProductActive(p.id, !p.is_active);
                    }}>
                      <button
                        type="submit"
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                          p.is_active ? "bg-[#17a2b8]" : "bg-white/20"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          p.is_active ? "translate-x-5" : "translate-x-0.5"
                        }`} />
                      </button>
                    </form>
                  </td>

                  {/* Delete */}
                  <td className="py-4">
                    <form action={async () => {
                      "use server";
                      await deleteProduct(p.id);
                    }}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
