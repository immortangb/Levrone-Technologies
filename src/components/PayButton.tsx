"use client";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    PaystackPop?: { setup: (opts: Record<string, unknown>) => { openIframe: () => void } };
  }
}

export default function PayButton({ email, amount, bookingReference, onPaid }: { email: string; amount: number; bookingReference: string; onPaid: () => void }) {
  const [loading, setLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  function pay() {
    if (!publicKey || !window.PaystackPop) return;
    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: Math.round(amount * 100), // Paystack expects the smallest currency unit (cents)
      currency: "ZAR",
      ref: `${bookingReference}-${Date.now()}`,
      callback: (response: { reference: string }) => {
        fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paystackReference: response.reference, bookingReference }),
        })
          .then((r) => r.json())
          .then((r) => { setLoading(false); if (r.ok) onPaid(); })
          .catch(() => setLoading(false));
      },
      onClose: () => setLoading(false),
    });
    handler.openIframe();
  }

  if (!publicKey) {
    return <p className="text-sm text-neutral-500">Online payment isn't set up yet — pay in person or over EFT for now.</p>;
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <button onClick={pay} disabled={loading} className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60">
        {loading ? "Opening payment…" : `Pay R${amount.toLocaleString("en-US")} now`}
      </button>
    </>
  );
}
