import { supabase } from "@/lib/supabase";
import { fallbackSettings, type Product, type ServiceGroup, type Settings } from "@/lib/data";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("sort_order");
  if (error || !data) return [];
  return data as Product[];
}

export async function getServiceGroups(): Promise<ServiceGroup[]> {
  const [{ data: groups }, { data: items }] = await Promise.all([
    supabase.from("service_groups").select("*").order("sort_order"),
    supabase.from("service_items").select("*").order("sort_order"),
  ]);
  return (groups ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    blurb: g.blurb,
    items: (items ?? []).filter((i) => i.group_id === g.id),
  })) as ServiceGroup[];
}

export async function getSettings(): Promise<Settings> {
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data ?? fallbackSettings;
}
