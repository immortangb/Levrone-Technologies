"use client";
import { useState } from "react";
import { Wrench, Laptop, Camera, Headphones } from "lucide-react";
import type { ServiceGroup } from "@/lib/data";

const icons = { repairs: Wrench, sales: Laptop, cctv: Camera, support: Headphones };

export default function ServiceCard({ group }: { group: ServiceGroup }) {
  const [open, setOpen] = useState(false);
  const Icon = icons[group.id];
  const items = open ? group.items : group.items.slice(0, 4);
  return (
    <article id={group.id} className="scroll-mt-32 flex flex-col rounded-lg border border-slate-200 bg-white">
      <div className="flex items-start gap-3 border-b border-slate-100 p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand text-white"><Icon size={22} /></span>
        <div>
          <h3 className="font-bold text-ink">{group.title}</h3>
          <p className="text-sm text-slate-600">{group.blurb}</p>
        </div>
      </div>
      <ul className="divide-y divide-slate-100 px-4">
        {items.map((s) => (
          <li key={s.name} className="flex justify-between gap-3 py-2 text-sm">
            <span>{s.name}</span>
            <span className="shrink-0 font-semibold text-brand">{s.price}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="m-4 mt-auto rounded-md border border-brand py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {open ? "Show fewer" : `View all ${group.items.length} services`}
      </button>
    </article>
  );
}
