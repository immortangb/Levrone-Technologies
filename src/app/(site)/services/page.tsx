import type { Metadata } from "next";
import ServiceGroupBlock from "@/components/ServiceGroupBlock";
import { getServiceGroups } from "@/lib/queries";

export const metadata: Metadata = { title: "Services | Levrone Technologies" };

export default async function ServicesPage() {
  const serviceGroups = await getServiceGroups();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Services</p>
      <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold">Repairs, installs and support, priced upfront</h1>
      <p className="mt-4 max-w-xl text-neutral-600">Every price below is a starting point — the exact cost depends on your device and what's wrong with it. Get in touch for a firm quote.</p>
      <div className="mt-8">
        {serviceGroups.map((g) => <ServiceGroupBlock key={g.id} group={g} />)}
      </div>
    </div>
  );
}
