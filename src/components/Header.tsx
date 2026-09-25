"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { business } from "@/lib/data";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Laptops", "/products"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          Levrone <span className="font-normal text-neutral-500">Technologies</span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 text-sm md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`border-b-2 pb-0.5 transition-colors ${pathname === href ? "border-ink" : "border-transparent text-neutral-600 hover:border-neutral-300 hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hidden rounded-full border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-white md:inline-block">
          {business.phone}
        </a>
        <button aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav aria-label="Primary mobile" className="border-t border-line px-4 py-3 md:hidden">
          <ul className="grid gap-3 text-sm">
            {links.map(([label, href]) => (
              <li key={href}><Link href={href} onClick={() => setOpen(false)} className={pathname === href ? "font-semibold" : "text-neutral-600"}>{label}</Link></li>
            ))}
            <li><a href={`tel:${business.phone.replace(/\s/g, "")}`} className="font-semibold">{business.phone}</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
