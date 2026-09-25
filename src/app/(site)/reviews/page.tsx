import type { Metadata } from "next";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReviewForm from "@/components/ReviewForm";
import { getServiceGroups } from "@/lib/queries";

export const metadata: Metadata = { title: "Reviews | Levrone Technologies" };

export default async function ReviewsPage() {
  const [{ data: reviews }, serviceGroups] = await Promise.all([
    supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }),
    getServiceGroups(),
  ]);
  const list = reviews ?? [];
  const average = list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Reviews</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold">What clients say</h1>
      {average && (
        <p className="mt-3 flex items-center gap-2 text-neutral-600">
          <span className="flex text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < Math.round(Number(average)) ? "currentColor" : "none"} />)}</span>
          {average} average from {list.length} review{list.length === 1 ? "" : "s"}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-4">
          {list.length === 0 && <p className="text-neutral-600">No reviews yet — be the first.</p>}
          {list.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{r.name}</p>
                <span className="flex text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />)}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-700">{r.comment}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold">Leave a review</h2>
          <div className="mt-4"><ReviewForm serviceGroups={serviceGroups} /></div>
        </div>
      </div>
    </div>
  );
}
