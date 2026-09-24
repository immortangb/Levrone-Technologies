"use client";
import { useState } from "react";
import type { Product } from "@/lib/data";

export default function ProductGrid({ products, initialQuery }: { products: Product[]; initialQuery: string }) {
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))];
  const [brand, setBrand] = useState("All");
  const q = initialQuery.trim().toLowerCase();
  const shown = products.filter(
    (p) => (brand === "All" || p.brand === brand) && (!q || `${p.name} ${p.brand} ${p.specs}`.toLowerCase().includes(q))
  );
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            aria-pressed={brand === b}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${brand === b ? "border-brand bg-brand text-white" : "border-slate-300 bg-white hover:border-brand"}`}
          >
            {b}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-slate-600">
          No laptops match your search. Clear it, or <a className="font-semibold text-brand underline" href="#contact">ask us for a quote</a>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <article key={p.name} className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="grid h-40 place-items-center bg-slate-100 text-2xl font-bold text-slate-400">{p.brand}</div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="font-bold text-ink">{p.name}</h3>
                <p className="text-sm text-slate-600">{p.specs}</p>
                <p className="text-sm text-slate-600">{p.display}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-xl font-bold text-ink">R{p.price.toLocaleString("en-US")}</span>
                  <a href="#contact" className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">Enquire</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
