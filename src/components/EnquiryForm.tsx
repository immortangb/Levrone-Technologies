"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { ServiceGroup } from "@/lib/data";

const field = "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

export default function EnquiryForm({ serviceGroups }: { serviceGroups: ServiceGroup[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus("sending");
    const { error } = await supabase.from("enquiries").insert({
      name: String(d.get("name")),
      email: String(d.get("email")),
      phone: String(d.get("phone") || "") || null,
      service: String(d.get("service") || "") || null,
      message: String(d.get("message") || "") || null,
    });
    if (error) return setStatus("error");
    form.reset();
    setStatus("sent");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Name *<input name="name" required maxLength={100} placeholder="Your name" className={`mt-1.5 ${field}`} /></label>
      <label className="text-sm font-medium">Email *<input name="email" type="email" required maxLength={200} placeholder="you@email.com" className={`mt-1.5 ${field}`} /></label>
      <label className="text-sm font-medium">Phone<input name="phone" maxLength={30} placeholder="Your phone number" className={`mt-1.5 ${field}`} /></label>
      <label className="text-sm font-medium">Service needed
        <select name="service" defaultValue="" className={`mt-1.5 ${field}`}>
          <option value="">Select a service</option>
          {serviceGroups.map((g) => <option key={g.id} value={g.title}>{g.title}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium sm:col-span-2">Message
        <textarea name="message" rows={4} maxLength={2000} placeholder="Tell us what you need" className={`mt-1.5 ${field}`} />
      </label>
      <button disabled={status === "sending"} className="rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 sm:col-span-2">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" className="text-sm sm:col-span-2">
        {status === "sent" && "Message sent — we'll get back to you within 24 hours."}
        {status === "error" && "Your message didn't send. Check your connection and try again, or call us."}
      </p>
    </form>
  );
}
