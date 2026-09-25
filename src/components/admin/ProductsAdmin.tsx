"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Product } from "@/lib/data";

const supabase = createClient();
const empty = { name: "", brand: "", specs: "", display: "", price: 0, image: "" };

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("sort_order");
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(id: string, patch: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function save(p: Product) {
    setSavingId(p.id);
    await supabase.from("products").update({
      name: p.name, brand: p.brand, specs: p.specs, display: p.display, price: p.price, image: p.image,
    }).eq("id", p.id);
    setSavingId(null);
  }

  async function addProduct() {
    const { data } = await supabase.from("products").insert({ ...empty, sort_order: products.length }).select().single();
    if (data) setProducts((prev) => [...prev, data as Product]);
  }

  async function remove(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function uploadImage(id: string, file: File) {
    setUploadingId(id);
    const path = `${id}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      update(id, { image: data.publicUrl });
    } else {
      alert("Upload failed: " + error.message);
    }
    setUploadingId(null);
  }

  if (loading) return <p className="text-neutral-600">Loading products…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Products</h1>
        <button onClick={addProduct} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">Add product</button>
      </div>

      <div className="mt-8 grid gap-6">
        {products.map((p) => (
          <div key={p.id} className="grid gap-4 rounded-lg border border-line bg-white p-5 sm:grid-cols-[140px_1fr]">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image || "https://placehold.co/300x225/f5f5f4/171717?text=No+image"} alt="" className="aspect-4/3 w-full rounded-md border border-line object-cover" />
              <label className="mt-2 block cursor-pointer text-center text-xs font-medium text-neutral-600 hover:text-ink">
                {uploadingId === p.id ? "Uploading…" : "Change photo"}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingId === p.id}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(p.id, f); }} />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-neutral-500">Name
                <input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-medium text-neutral-500">Brand
                <input value={p.brand} onChange={(e) => update(p.id, { brand: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-medium text-neutral-500">Specs
                <input value={p.specs} onChange={(e) => update(p.id, { specs: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-medium text-neutral-500">Display
                <input value={p.display} onChange={(e) => update(p.id, { display: e.target.value })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-medium text-neutral-500">Price (ZAR)
                <input type="number" min={0} value={p.price} onChange={(e) => update(p.id, { price: Number(e.target.value) })} className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm" />
              </label>
              <div className="flex items-end gap-2">
                <button onClick={() => save(p)} disabled={savingId === p.id} className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
                  {savingId === p.id ? "Saving…" : "Save"}
                </button>
                <button onClick={() => remove(p.id)} className="rounded-full border border-line px-4 py-2 text-xs font-medium text-red-600 hover:border-red-300">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-neutral-600">No products yet. Click "Add product" to create one.</p>}
      </div>
    </div>
  );
}
