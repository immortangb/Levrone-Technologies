import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/lib/data";

export const metadata: Metadata = { title: "Laptops | Levrone Technologies" };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Laptops</p>
      <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold">New and refurbished, all under warranty</h1>
      <p className="mt-4 max-w-xl text-neutral-600">Every laptop we sell is checked, cleaned and backed by a warranty. Don't see the brand or spec you want? Ask — we can usually source it.</p>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
