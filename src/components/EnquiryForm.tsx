"use client";
import { useState, type FormEvent } from "react";
import { submitQuote } from "@/app/actions/bookings";
import type { ServiceGroup } from "@/lib/data";

const field = "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink";

export default function EnquiryForm({ serviceGroups }: { serviceGroups: ServiceGroup[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus("sending");
    try {
      const result = await submitQuote({
        name: String(d.get("name")),
        email: String(d.get("email")),
        phone: String(d.get("phone") || ""),
        service: String(d.get("service") || ""),
        message: String(d.get("message") || ""),
      });
      if (!result.ok) { setErrorMsg(result.error); setStatus("error"); return; }
      form.reset();
      setReference(result.reference);
      setStatus("sent");
    } catch {
      setErrorMsg("Something went wrong on our end. Try again, or contact us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-line bg-white p-6">
        <p className="text-sm text-neutral-700">Your reference number is</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-accent-dark">{reference}</p>
        <p className="mt-3 text-sm text-neutral-600">We'll reply within 24 hours. Save this reference to check progress any time on the <a href="/track" className="underline underline-offset-4">Track status</a> page.</p>
      </div>
    );
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
      {status === "error" && <p className="text-sm text-red-600 sm:col-span-2">{errorMsg || "Your message didn't send. Check your connection and try again, or call us."}</p>}
    </form>
  );
}
