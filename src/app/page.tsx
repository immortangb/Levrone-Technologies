import { Search, Phone, MapPin, Mail, Clock, GraduationCap, UserCheck, ShieldCheck, Timer, Tag, Award } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import ProductGrid from "@/components/ProductGrid";
import EnquiryForm from "@/components/EnquiryForm";
import { business, serviceGroups, products, reasons } from "@/lib/data";

const reasonIcons = [UserCheck, ShieldCheck, Timer, Tag, Award];
const nav = [["Repairs", "#repairs"], ["Laptop Sales", "#sales"], ["CCTV", "#cctv"], ["IT Support", "#support"], ["Laptops", "#products"], ["About", "#about"], ["Contact", "#contact"]];
const stats = [["500+", "Devices repaired"], ["1000+", "Happy customers"], ["5+", "Years experience"], ["24/7", "Support available"]];
const wrap = "mx-auto w-full max-w-7xl px-4";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return (
    <>
      <div className="bg-ink text-xs text-white">
        <div className={`${wrap} flex items-center justify-between py-1.5`}>
          <span className="flex items-center gap-1.5"><GraduationCap size={14} /> 10% student discount for UFS students with a valid student card</span>
          <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hidden sm:block">Call {business.phone}</a>
        </div>
      </div>

      <header className="sticky top-0 z-20 bg-brand text-white shadow">
        <div className={`${wrap} flex flex-wrap items-center gap-3 py-3`}>
          <a href="#top" className="text-2xl font-extrabold tracking-tight">Levrone<span className="text-accent">Tech</span></a>
          <form action="/#products" method="get" role="search" className="order-3 flex w-full overflow-hidden rounded-md bg-white md:order-none md:w-auto md:flex-1">
            <input name="q" defaultValue={q} aria-label="Search laptops" placeholder="Search laptops and brands" className="min-w-0 flex-1 px-4 py-2.5 text-ink outline-none" />
            <button aria-label="Search" className="bg-accent px-5 text-white"><Search size={20} /></button>
          </form>
          <a href="#contact" className="ml-auto rounded-md bg-accent px-4 py-2.5 text-sm font-bold hover:opacity-90 md:ml-0">Get a quote</a>
        </div>
        <nav aria-label="Departments" className="bg-white text-ink">
          <ul className={`${wrap} flex gap-6 overflow-x-auto whitespace-nowrap py-2.5 text-sm font-semibold`}>
            {nav.map(([label, href]) => (<li key={href}><a href={href} className="hover:text-brand">{label}</a></li>))}
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className={`${wrap} grid gap-4 py-5 lg:grid-cols-3`}>
          <div className="rounded-lg bg-gradient-to-br from-brand to-ink p-8 text-white lg:col-span-2 lg:p-12">
            <p className="text-sm font-semibold text-sky-200">Professional IT services in Bloemfontein</p>
            <h1 className="mt-2 max-w-xl text-4xl font-extrabold leading-tight lg:text-5xl">Fast, fair tech repairs, sales and support</h1>
            <p className="mt-4 max-w-lg text-sky-100">Laptop repairs, laptop sales, CCTV installation and IT support for homes and businesses.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#repairs" className="rounded-md bg-accent px-5 py-3 font-bold">Browse services</a>
              <a href="#contact" className="rounded-md border border-white px-5 py-3 font-bold">Contact us</a>
            </div>
            <dl className="mt-8 flex flex-wrap gap-3 text-sm">
              {[["Basic repairs", "From R350"], ["Hardware repairs", "From R750"], ["CCTV installation", "From R2500"]].map(([k, v]) => (
                <div key={k} className="rounded-md bg-white/10 px-4 py-2"><dt className="text-sky-200">{k}</dt><dd className="text-lg font-bold">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="grid gap-4">
            <a href="#contact" className="rounded-lg bg-accent p-6 text-white">
              <GraduationCap size={28} />
              <p className="mt-2 text-2xl font-extrabold">10% student discount</p>
              <p className="text-sm">UFS Bloemfontein students save on all services and products. Show your valid student card.</p>
            </a>
            <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="rounded-lg border border-slate-200 bg-white p-6">
              <Phone size={28} className="text-brand" />
              <p className="mt-2 text-2xl font-extrabold">{business.phone}</p>
              <p className="text-sm text-slate-600">{business.hours}</p>
            </a>
          </div>
        </section>

        <section aria-label="Highlights" className={`${wrap} pb-5`}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-4">
            {stats.map(([n, l]) => (<div key={l} className="bg-white p-4 text-center"><dt className="sr-only">{l}</dt><dd className="text-2xl font-extrabold text-brand">{n}</dd><p className="text-sm text-slate-600">{l}</p></div>))}
          </dl>
        </section>

        <section className={`${wrap} py-5`}>
          <h2 className="mb-4 text-2xl font-extrabold">Shop by department</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-start">
            {serviceGroups.map((g) => <ServiceCard key={g.id} group={g} />)}
          </div>
        </section>

        <section id="products" className={`${wrap} scroll-mt-32 py-5`}>
          <h2 className="text-2xl font-extrabold">Laptops &amp; computers</h2>
          <p className="mb-4 text-slate-600">Quality laptops from top brands. All devices come with warranty and support.</p>
          <ProductGrid products={products} initialQuery={q} />
        </section>

        <section id="about" className={`${wrap} scroll-mt-32 py-5`}>
          <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8">
            <h2 className="text-2xl font-extrabold">Your trusted technology partner in Bloemfontein</h2>
            <p className="mt-2 max-w-3xl text-slate-600">Levrone Technologies is your local IT expert, providing technology solutions for individuals and businesses. From laptop repairs to CCTV installations, our technicians use quality parts and the latest techniques to keep your devices performing at their best.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {reasons.map(([t, d], n) => { const Icon = reasonIcons[n]; return (
                <li key={t} className="rounded-md bg-slate-50 p-4">
                  <Icon className="text-brand" size={24} /><h3 className="mt-2 font-bold">{t}</h3><p className="text-sm text-slate-600">{d}</p>
                </li>); })}
            </ul>
          </div>
        </section>

        <section id="contact" className={`${wrap} scroll-mt-32 py-5`}>
          <h2 className="text-2xl font-extrabold">Get in touch</h2>
          <p className="mb-4 text-slate-600">Have a question or need a quote? Send a message and we will reply within 24 hours.</p>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2"><EnquiryForm /></div>
            <ul className="grid content-start gap-3">
              {[[MapPin, "Address", business.address], [Phone, "Phone", business.phone], [Mail, "Email", business.email], [Clock, "Hours", business.hours]].map(([Icon, l, v]) => {
                const I = Icon as typeof MapPin; return (
                <li key={l as string} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <I className="text-brand" /><div><p className="text-xs text-slate-500">{l as string}</p><p className="font-semibold">{v as string}</p></div>
                </li>); })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="mt-8 bg-ink text-sm text-slate-300">
        <div className={`${wrap} grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4`}>
          <div><p className="text-xl font-extrabold text-white">Levrone<span className="text-accent">Tech</span></p><p className="mt-2">Professional IT services in Bloemfontein.</p></div>
          <div><p className="font-bold text-white">Departments</p><ul className="mt-2 grid gap-1">{serviceGroups.map((g) => <li key={g.id}><a href={`#${g.id}`} className="hover:text-white">{g.title}</a></li>)}</ul></div>
          <div><p className="font-bold text-white">Contact</p><ul className="mt-2 grid gap-1"><li>{business.phone}</li><li>{business.email}</li><li>{business.address}</li></ul></div>
          <div><p className="font-bold text-white">Hours</p><p className="mt-2">{business.hours}</p><p className="mt-2">10% student discount for UFS students.</p></div>
        </div>
        <p className="border-t border-white/10 py-4 text-center">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
      </footer>
    </>
  );
}
