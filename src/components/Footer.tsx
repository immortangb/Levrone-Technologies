import Link from "next/link";
import { business, serviceGroups } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold">Levrone Technologies</p>
          <p className="mt-2 max-w-xs text-sm text-neutral-600">IT repairs, laptop sales, CCTV installation and support, done properly.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Services</p>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-600">
            {serviceGroups.map((g) => <li key={g.id}><Link href={`/services#${g.id}`} className="hover:text-ink">{g.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-600">
            <li><a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hover:text-ink">{business.phone}</a></li>
            <li><a href={`mailto:${business.email}`} className="hover:text-ink">{business.email}</a></li>
            <li>{business.hours}</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-5 text-center text-xs text-neutral-500">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
    </footer>
  );
}
