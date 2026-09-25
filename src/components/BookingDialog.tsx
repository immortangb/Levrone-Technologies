"use client";
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { submitServiceBooking, submitProductBooking } from "@/app/actions/bookings";

type Target =
  | { kind: "service"; groupId: string; groupTitle: string; itemName: string; itemPrice: string }
  | { kind: "product"; productId: string; productName: string; amount: number };

export default function BookingDialog({ target, onClose }: { target: Target; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") || "");
    const email = String(d.get("email") || "");
    const phone = String(d.get("phone") || "");
    setState("sending");

    const result = target.kind === "service"
      ? await submitServiceBooking({ name, email, phone, groupId: target.groupId, groupTitle: target.groupTitle, itemName: target.itemName, itemPrice: target.itemPrice, message: String(d.get("message") || "") })
      : await submitProductBooking({ name, email, phone, productId: target.productId, productName: target.productName, amount: target.amount });

    if (!result.ok) { setErrorMsg(result.error); setState("error"); return; }
    setReference(result.reference);
    setState("done");
  }

  const title = target.kind === "service" ? target.itemName : target.productName;

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 px-4" role="dialog" aria-modal="true" aria-label={`Book ${title}`}>
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{target.kind === "service" ? "Request this service" : "Order this laptop"}</p>
            <h2 className="mt-1 font-serif text-xl font-semibold">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-ink"><X size={20} /></button>
        </div>

        {state === "done" ? (
          <div className="mt-6">
            <p className="text-sm text-neutral-700">Your reference number is</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-accent-dark">{reference}</p>
            <p className="mt-3 text-sm text-neutral-600">Save this — use it on the <a href="/track" className="underline underline-offset-4">Track status</a> page to check progress and, once it's complete, choose collection or delivery.</p>
            <button onClick={onClose} className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800">Done</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <label className="text-sm font-medium">Name *<input name="name" required maxLength={100} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
            <label className="text-sm font-medium">Email *<input name="email" type="email" required maxLength={200} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
            <label className="text-sm font-medium">Phone (for WhatsApp/SMS updates)<input name="phone" maxLength={30} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
            {target.kind === "service" && (
              <label className="text-sm font-medium">Anything we should know?<textarea name="message" rows={3} maxLength={1000} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" /></label>
            )}
            {state === "error" && <p className="text-sm text-red-600">{errorMsg || "Something went wrong — try again."}</p>}
            <button disabled={state === "sending"} className="mt-2 rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
              {state === "sending" ? "Sending…" : "Confirm booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
