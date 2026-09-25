"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/data";

export default function ProductGrid({ products }: { products: Product[] }) {
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))];
  const [brand, setBrand] = useState("All");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = products.filter(
    (p) => (brand === "All" || p.brand === brand) && (!q || `${p.name} ${p.brand} ${p.specs}`.toLowerCase().includes(q))
  );
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search laptops"
          aria-label="Search laptops"
          className="w-full max-w-xs rounded-full border border-line px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink sm:w-auto"
        />
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              aria-pressed={brand === b}
              className={`rounded-full border px-4 py-1.5 text-sm ${brand === b ? "border-ink bg-ink text-white" : "border-line text-neutral-600 hover:border-ink hover:text-ink"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-neutral-600">
          No laptops match that search. <Link href="/contact" className="underline underline-offset-4">Ask us for a quote</Link> — we can usually source what you need.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <article key={p.name} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="aspect-4/3 w-full rounded-lg border border-line object-cover" />
              <div className="mt-3">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-neutral-600">{p.specs}</p>
                <p className="text-sm text-neutral-600">{p.display}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-lg">R{p.price.toLocaleString("en-US")}</span>
                  <Link href="/contact" className="rounded-full border border-ink px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-white">Enquire</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
