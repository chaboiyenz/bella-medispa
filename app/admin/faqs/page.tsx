import { createAdminClient } from "@/lib/supabase/server";
import { FaqTableShell } from "@/components/admin/FaqTableShell";
import { FaqCRUDModal } from "@/components/admin/FaqCRUDModal";

const PAGE_SIZE = 20;

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const params   = await searchParams;
  const q        = params.q        ?? "";
  const category = params.category ?? "";
  const sort     = params.sort     ?? "";
  const page     = Math.max(1, parseInt(params.page ?? "1", 10));
  const from     = (page - 1) * PAGE_SIZE;
  const to       = from + PAGE_SIZE - 1;

  const supabase = await createAdminClient();

  let query = supabase
    .from("faqs")
    .select("*", { count: "exact" });

  if (q) {
    query = query.or(`question.ilike.%${q}%,answer.ilike.%${q}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (sort === "most_asked") {
    query = query.order("usage_count", { ascending: false });
  } else {
    query = query
      .order("category",  { ascending: true })
      .order("question",  { ascending: true });
  }

  const { data: faqs, count } = await query.range(from, to);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-white">FAQ Engine</h1>
          <p className="text-sm text-white/40 mt-1">
            {count ?? 0} questions · chatbot knowledge base
          </p>
        </div>
        <FaqCRUDModal />
      </div>

      <FaqTableShell
        faqs={faqs ?? []}
        total={count ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        initialQ={q}
        initialCategory={category}
        initialSort={sort}
      />
    </div>
  );
}
