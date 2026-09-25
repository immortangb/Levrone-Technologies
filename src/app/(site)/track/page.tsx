"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import PayButton from "@/components/PayButton";
import { statusLabels, eligibleForFulfillment, type BookingStatus, type Fulfillment } from "@/lib/data";

type TrackedBooking = {
  reference: string; type: "quote" | "service" | "product"; status: BookingStatus;
  fulfillment: Fulfillment | null; delivery_address: string | null;
  amount: number | null; paid: boolean; service_item_name: string | null; product_name: string | null;
  created_at: string; updated_at: string; service_group_id?: string | null;
};

const steps: BookingStatus[] = ["received", "in_progress", "completed"];

export default function TrackPage() {
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<TrackedBooking | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const [fulfillState, setFulfillState] = useState<"idle" | "saving" | "saved">("idle");
  const [address, setAddress] = useState("");
  const [choice, setChoice] = useState<Fulfillment>("collect");

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    const { data } = await supabase.rpc("get_booking_status", { p_reference: reference.trim(), p_contact: contact.trim() });
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) { setBooking(null); setState("notfound"); return; }
    setEmail(contact.includes("@") ? contact.trim() : "");
    setBooking(row);
    setState("found");
  }

  async function saveFulfillment() {
    if (!booking) return;
    setFulfillState("saving");
    const { data } = await supabase.rpc("set_booking_fulfillment", {
      p_reference: booking.reference, p_contact: contact.trim(), p_fulfillment: choice, p_address: choice === "delivery" ? address : null,
    });
    if (data) setBooking({ ...booking, fulfillment: choice, delivery_address: choice === "delivery" ? address : null });
    setFulfillState("saved");
  }

  const stepIndex = booking ? steps.indexOf(booking.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">Track status</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold">Check your booking</h1>
      <p className="mt-4 text-neutral-600">Enter your reference number and the email or phone you booked with.</p>

      <form onSubmit={lookup} className="mt-8 grid gap-4 rounded-lg border border-line bg-white p-6 sm:grid-cols-2">
        <label className="text-sm font-medium">Reference *
          <input value={reference} onChange={(e) => setReference(e.target.value)} required placeholder="LV-XXXXX" className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm font-mono" />
        </label>
        <label className="text-sm font-medium">Email or phone used to book *
          <input value={contact} onChange={(e) => setContact(e.target.value)} required className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" />
        </label>
        <button disabled={state === "loading"} className="rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 sm:col-span-2">
          {state === "loading" ? "Checking…" : "Check status"}
        </button>
      </form>

      {state === "notfound" && <p className="mt-4 text-sm text-red-600">We couldn't find a booking with that reference and contact detail. Check they're both exactly as you entered them when booking.</p>}

      {booking && (
        <div className="mt-8 rounded-lg border border-line bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-lg font-semibold">{booking.reference}</p>
            <p className="text-sm text-neutral-600">{booking.service_item_name || booking.product_name || "General quote"}</p>
          </div>

          {booking.status === "cancelled" ? (
            <p className="mt-6 rounded-md bg-paper px-4 py-3 text-sm">This booking was cancelled. Contact us if that's unexpected.</p>
          ) : (
            <ol className="mt-6 flex items-center gap-2">
              {steps.map((s, i) => (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${i <= stepIndex ? "bg-accent" : "bg-line"}`} />
                    <span className={`text-center text-xs ${i <= stepIndex ? "font-medium text-ink" : "text-neutral-400"}`}>{statusLabels[s]}</span>
                  </div>
                  {i < steps.length - 1 && <span className={`h-px flex-1 ${i < stepIndex ? "bg-accent" : "bg-line"}`} />}
                </li>
              ))}
            </ol>
          )}

          {booking.amount != null && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-paper px-4 py-3">
              <p className="text-sm">Amount due: <span className="font-mono font-semibold">R{Number(booking.amount).toLocaleString("en-US")}</span></p>
              {booking.paid ? (
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-dark">Paid</span>
              ) : email ? (
                <PayButton email={email} amount={Number(booking.amount)} bookingReference={booking.reference} onPaid={() => setBooking({ ...booking, paid: true })} />
              ) : (
                <p className="text-sm text-neutral-500">Look up with your email to pay online.</p>
              )}
            </div>
          )}

          {booking.status === "completed" && eligibleForFulfillment({ type: booking.type, service_group_id: booking.service_group_id ?? null }) && (
            <div className="mt-6 border-t border-line pt-6">
              {booking.fulfillment ? (
                <p className="text-sm">
                  You chose <strong>{booking.fulfillment === "collect" ? "collection" : "delivery"}</strong>
                  {booking.fulfillment === "delivery" && booking.delivery_address ? ` to: ${booking.delivery_address}` : ""}.
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium">Your device is ready. How would you like to get it?</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="fulfillment" checked={choice === "collect"} onChange={() => setChoice("collect")} /> Collect in-store</label>
                    <label className="flex items-center gap-2"><input type="radio" name="fulfillment" checked={choice === "delivery"} onChange={() => setChoice("delivery")} /> Delivery</label>
                  </div>
                  {choice === "delivery" && (
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className="mt-3 w-full rounded-md border border-line px-3 py-2 text-sm" />
                  )}
                  <button onClick={saveFulfillment} disabled={fulfillState === "saving" || (choice === "delivery" && !address)} className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
                    {fulfillState === "saving" ? "Saving…" : "Confirm"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
