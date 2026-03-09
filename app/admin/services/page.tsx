import { createAdminClient } from "@/lib/supabase/server";
import { ServicesManager } from "@/components/admin/ServicesManager";

export default async function AdminServicesPage() {
  const supabase = await createAdminClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div className="p-8">
      <ServicesManager services={services ?? []} />
    </div>
  );
}
