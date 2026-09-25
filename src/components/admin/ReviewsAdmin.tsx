"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const supabase = createClient();
type Review = { id: string; name: string; rating: number; comment: string; approved: boolean; created_at: string };

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setApproved(id: string, approved: boolean) {
    await supabase.from("reviews").update({ approved }).eq("id", id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
  }
  async function remove(id: string) {
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <p className="text-neutral-600">Loading reviews…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Reviews</h1>
      <p className="mt-2 text-neutral-600">New reviews are hidden until you approve them.</p>
      <div className="mt-8 grid gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.name} <span className="ml-2 text-sm text-neutral-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></p>
                <p className="mt-1 text-sm text-neutral-700">{r.comment}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${r.approved ? "bg-accent/20 text-accent-dark" : "bg-paper text-neutral-600"}`}>{r.approved ? "Live" : "Pending"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {!r.approved && <button onClick={() => setApproved(r.id, true)} className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800">Approve</button>}
              {r.approved && <button onClick={() => setApproved(r.id, false)} className="rounded-full border border-line px-4 py-1.5 text-xs font-medium hover:border-ink">Unpublish</button>}
              <button onClick={() => remove(r.id)} className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-red-600 hover:border-red-300">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-neutral-600">No reviews yet.</p>}
      </div>
    </div>
  );
}
