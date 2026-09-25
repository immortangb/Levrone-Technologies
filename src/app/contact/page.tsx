import type { Metadata } from "next";
import { Phone, Mail, Clock } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { business } from "@/lib/data";

export const metadata: Metadata = { title: "Contact | Levrone Technologies" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Contact</p>
      <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold">Get in touch</h1>
      <p className="mt-4 max-w-xl text-neutral-600">Send a message and we'll reply within 24 hours, or call us directly during business hours.</p>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <ul className="grid content-start gap-8 border-t border-line pt-8">
          <li className="flex gap-4"><Phone className="mt-0.5 shrink-0" size={20} /><div><p className="text-sm text-neutral-500">Phone</p><a href={`tel:${business.phone.replace(/\s/g, "")}`} className="font-medium hover:underline">{business.phone}</a></div></li>
          <li className="flex gap-4"><Mail className="mt-0.5 shrink-0" size={20} /><div><p className="text-sm text-neutral-500">Email</p><a href={`mailto:${business.email}`} className="font-medium hover:underline">{business.email}</a></div></li>
          <li className="flex gap-4"><Clock className="mt-0.5 shrink-0" size={20} /><div><p className="text-sm text-neutral-500">Hours</p><p className="font-medium">{business.hours}</p></div></li>
        </ul>
        <div className="border-t border-line pt-8">
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
