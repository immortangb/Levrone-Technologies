"use client";
import { useState } from "react";
import type { ServiceGroup } from "@/lib/data";

export default function ServiceGroupBlock({ group }: { group: ServiceGroup }) {
  const [open, setOpen] = useState(false);
  const items = open ? group.items : group.items.slice(0, 6);
  return (
    <section id={group.id} className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold">{group.title}</h2>
          <p className="mt-3 text-sm text-neutral-600">{group.blurb}</p>
        </div>
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {items.map((s) => (
              <li key={s.name} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-sm">{s.name}</span>
                <span className="shrink-0 font-mono text-sm text-neutral-600">{s.price}</span>
              </li>
            ))}
          </ul>
          {group.items.length > 6 && (
            <button onClick={() => setOpen(!open)} className="mt-4 text-sm font-medium underline underline-offset-4 hover:no-underline">
              {open ? "Show fewer" : `Show all ${group.items.length} services`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
