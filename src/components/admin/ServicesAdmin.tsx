"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { ServiceGroup, ServiceItem } from "@/lib/data";

const supabase = createClient();

export default function ServicesAdmin() {
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [{ data: g }, { data: items }] = await Promise.all([
      supabase.from("service_groups").select("*").order("sort_order"),
      supabase.from("service_items").select("*").order("sort_order"),
    ]);
    setGroups((g ?? []).map((row) => ({ ...row, items: (items ?? []).filter((i) => i.group_id === row.id) })) as ServiceGroup[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function updateGroup(id: string, patch: Partial<ServiceGroup>) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }
  function updateItem(groupId: string, itemId: string, patch: Partial<ServiceItem>) {
    setGroups((prev) => prev.map((g) => g.id !== groupId ? g : { ...g, items: g.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }));
  }

  async function saveGroup(g: ServiceGroup) {
    setSavingGroup(g.id);
    await supabase.from("service_groups").update({ title: g.title, blurb: g.blurb }).eq("id", g.id);
    setSavingGroup(null);
  }

  async function saveItem(item: ServiceItem) {
    await supabase.from("service_items").update({ name: item.name, price: item.price }).eq("id", item.id);
  }

  async function addItem(groupId: ServiceGroup["id"]) {
    const group = groups.find((g) => g.id === groupId)!;
    const { data } = await supabase.from("service_items").insert({
      group_id: groupId, name: "New service", price: "Quote Based", sort_order: group.items.length,
    }).select().single();
    if (data) updateGroupItems(groupId, [...group.items, data as ServiceItem]);
  }

  function updateGroupItems(groupId: string, items: ServiceItem[]) {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, items } : g)));
  }

  async function removeItem(groupId: string, itemId: string) {
    await supabase.from("service_items").delete().eq("id", itemId);
    setGroups((prev) => prev.map((g) => (g.id !== groupId ? g : { ...g, items: g.items.filter((i) => i.id !== itemId) })));
  }

  if (loading) return <p className="text-neutral-600">Loading services…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Services</h1>
      <p className="mt-2 text-neutral-600">There are four fixed categories. Edit their names, blurbs, and the line items inside each.</p>

      <div className="mt-8 grid gap-8">
        {groups.map((g) => (
          <div key={g.id} className="rounded-lg border border-line bg-white p-6">
            <div className="grid gap-3 sm:grid-cols-[1fr_2fr] sm:items-start">
              <label className="text-xs font-medium text-neutral-500">Category title
                <input value={g.title} onChange={(e) => updateGroup(g.id, { title: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm font-medium" />
              </label>
              <label className="text-xs font-medium text-neutral-500">Description
                <input value={g.blurb} onChange={(e) => updateGroup(g.id, { blurb: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
            </div>
            <button onClick={() => saveGroup(g)} disabled={savingGroup === g.id} className="mt-3 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
              {savingGroup === g.id ? "Saving…" : "Save category details"}
            </button>

            <ul className="mt-6 grid gap-2 border-t border-line pt-4">
              {g.items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center gap-2">
                  <input value={item.name} onChange={(e) => updateItem(g.id, item.id, { name: e.target.value })} onBlur={() => saveItem({ ...item, name: item.name })} className="min-w-[10rem] flex-1 rounded-md border border-line px-3 py-1.5 text-sm" />
                  <input value={item.price} onChange={(e) => updateItem(g.id, item.id, { price: e.target.value })} onBlur={() => saveItem({ ...item, price: item.price })} className="w-36 rounded-md border border-line px-3 py-1.5 text-sm font-mono" />
                  <button onClick={() => removeItem(g.id, item.id)} className="rounded-full border border-line px-3 py-1.5 text-xs text-red-600 hover:border-red-300">Remove</button>
                </li>
              ))}
            </ul>
            <button onClick={() => addItem(g.id)} className="mt-3 text-sm font-medium underline underline-offset-4 hover:no-underline">+ Add a service line</button>
            <p className="mt-2 text-xs text-neutral-400">Name and price fields save automatically when you click away from them.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
