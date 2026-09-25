import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { reasons } from "@/lib/data";

export const metadata: Metadata = { title: "About | Levrone Technologies" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">About</p>
      <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold">Your local IT partner</h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-600">
        Levrone Technologies provides technology solutions for individuals and businesses — from laptop repairs to CCTV installations. We use quality parts and take the time to explain what we're doing and why, so you're never left guessing.
      </p>

      <ul className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-5">
        {reasons.map(([t, d]) => (
          <li key={t}>
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-neutral-600">{d}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex items-center justify-between gap-4 rounded-lg border border-line bg-paper p-8">
        <p className="font-serif text-xl font-semibold">Have a device that needs attention?</p>
        <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800">
          Get a quote <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
