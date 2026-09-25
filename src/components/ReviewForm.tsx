"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { ServiceGroup } from "@/lib/data";

export default function ReviewForm({ serviceGroups }: { serviceGroups: ServiceGroup[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [rating, setRating] = useState(5);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus("sending");
    const { error } = await supabase.from("reviews").insert({
      name: String(d.get("name")),
      rating,
      comment: String(d.get("comment")),
      service_group_id: String(d.get("service") || "") || null,
    });
    if (error) return setStatus("error");
    form.reset();
    setRating(5);
    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="rounded-lg border border-line bg-white p-6 text-sm text-neutral-700">Thanks — your review has been sent for approval and will appear here shortly.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-line bg-white p-6">
      <label className="text-sm font-medium">Your name *<input name="name" required maxLength={100} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
      <label className="text-sm font-medium">Service (optional)
        <select name="service" defaultValue="" className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm">
          <option value="">General</option>
          {serviceGroups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      </label>
      <fieldset className="text-sm font-medium">
        Rating
        <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)} aria-pressed={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={`h-9 w-9 rounded-md border text-sm font-semibold ${rating >= n ? "border-accent bg-accent text-white" : "border-line text-neutral-400"}`}>
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="text-sm font-medium">Your review *<textarea name="comment" required rows={4} maxLength={1000} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
      {status === "error" && <p className="text-sm text-red-600">Your review didn't send — try again.</p>}
      <button disabled={status === "sending"} className="rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
