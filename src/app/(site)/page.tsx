import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts, getServiceGroups } from "@/lib/queries";
import { reasons } from "@/lib/data";

const stats = [["500+", "Devices repaired"], ["1,000+", "Customers served"], ["5+", "Years in business"], ["24/7", "Support available"]];

export default async function Home() {
  const [serviceGroups, products] = await Promise.all([getServiceGroups(), getProducts()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20">
        <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Bloemfontein, South Africa</p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl font-semibold leading-[1.1] sm:text-6xl">
          Technology, repaired and sold properly.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-neutral-600">
          Laptop and desktop repairs, laptop sales, CCTV installation and IT support — handled by certified technicians who use quality parts and explain what they're doing.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800">
            Browse services <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm font-medium hover:bg-paper">
            Get a quote
          </Link>
        </div>
      </section>

      <section aria-label="Track record" className="border-y border-line bg-paper">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
          {stats.map(([n, l]) => (
            <div key={l}><dt className="sr-only">{l}</dt><dd className="font-serif text-3xl font-semibold">{n}</dd><p className="mt-1 text-sm text-neutral-600">{l}</p></div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold">What we do</h2>
          <Link href="/services" className="hidden text-sm font-medium text-neutral-600 hover:text-ink sm:inline-flex sm:items-center sm:gap-1">
            All services <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {serviceGroups.map((g) => (
            <Link key={g.id} href={`/services#${g.id}`} className="group flex flex-col justify-between gap-6 bg-white p-8 hover:bg-paper">
              <div>
                <h3 className="font-serif text-xl font-semibold">{g.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{g.blurb}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium">
                {g.items.length} services <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl font-semibold">Laptops in stock</h2>
            <Link href="/products" className="hidden text-sm font-medium text-neutral-600 hover:text-ink sm:inline-flex sm:items-center sm:gap-1">
              All laptops <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href="/products" className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="aspect-4/3 w-full rounded-lg border border-line object-cover" />
                <p className="mt-3 font-medium">{p.name}</p>
                <p className="font-mono text-sm text-neutral-600">R{Number(p.price).toLocaleString("en-US")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-serif text-3xl font-semibold">Why people choose us</h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map(([t, d]) => (
            <li key={t} className="border-t border-ink pt-4">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-neutral-600">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-3xl font-semibold">Ready to fix, upgrade or install something?</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink hover:bg-neutral-200">
            Get a free quote <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
