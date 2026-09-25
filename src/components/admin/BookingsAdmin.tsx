"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { statusLabels, type Booking, type BookingStatus } from "@/lib/data";

const supabase = createClient();
const statusOptions: BookingStatus[] = ["received", "in_progress", "completed", "cancelled"];
const typeLabels: Record<Booking["type"], string> = { quote: "Quote", service: "Service", product: "Laptop order" };

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings((data as Booking[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(id: string, patch: Partial<Booking>) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function save(b: Booking) {
    setSavingId(b.id);
    await supabase.from("bookings").update({ status: b.status, amount: b.amount, paid: b.paid }).eq("id", b.id);
    setSavingId(null);
  }

  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <p className="text-neutral-600">Loading bookings…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Bookings</h1>
        <div className="flex flex-wrap gap-2">
          {(["all", ...statusOptions] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 text-sm ${filter === f ? "border-ink bg-ink text-white" : "border-line text-neutral-600 hover:border-ink"}`}>
              {f === "all" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {shown.map((b) => (
          <div key={b.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono font-semibold">{b.reference} <span className="ml-2 rounded-full bg-paper px-2.5 py-0.5 text-xs font-sans font-medium text-neutral-600">{typeLabels[b.type]}</span></p>
                <p className="mt-1 text-sm">{b.name} — {b.phone || b.email}</p>
                <p className="text-sm text-neutral-600">{b.service_item_name || b.product_name || "General enquiry"}</p>
                {b.message && <p className="mt-1 text-sm text-neutral-500">"{b.message}"</p>}
                {b.fulfillment && <p className="mt-1 text-xs text-accent-dark">Chose {b.fulfillment}{b.delivery_address ? ` — ${b.delivery_address}` : ""}</p>}
              </div>
              <p className="text-xs text-neutral-400">{new Date(b.created_at).toLocaleString("en-ZA")}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
              <label className="text-xs font-medium text-neutral-500">Status
                <select value={b.status} onChange={(e) => update(b.id, { status: e.target.value as BookingStatus })} className="mt-1 block rounded-md border border-line px-3 py-1.5 text-sm">
                  {statusOptions.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </label>
              <label className="text-xs font-medium text-neutral-500">Amount (ZAR)
                <input type="number" min={0} value={b.amount ?? ""} onChange={(e) => update(b.id, { amount: e.target.value === "" ? null : Number(e.target.value) })} className="mt-1 block w-32 rounded-md border border-line px-3 py-1.5 text-sm" />
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                <input type="checkbox" checked={b.paid} onChange={(e) => update(b.id, { paid: e.target.checked })} /> Paid
              </label>
              <button onClick={() => save(b)} disabled={savingId === b.id} className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
                {savingId === b.id ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-neutral-600">No bookings here yet.</p>}
      </div>
    </div>
  );
}
