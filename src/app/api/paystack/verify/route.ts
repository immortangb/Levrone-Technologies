import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsApp } from "@/lib/whatsapp";

// Called after the Paystack popup closes with a successful charge. We
// re-verify server-side with the secret key rather than trusting the
// client callback, then mark the booking paid.
export async function POST(req: Request) {
  const { paystackReference, bookingReference } = await req.json();
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false, error: "Paystack is not configured." }, { status: 500 });
  if (!paystackReference || !bookingReference) return NextResponse.json({ ok: false, error: "Missing reference." }, { status: 400 });

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(paystackReference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const verify = await verifyRes.json();

  if (!verify.status || verify.data?.status !== "success") {
    return NextResponse.json({ ok: false, error: "Payment could not be verified." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ paid: true, payment_reference: paystackReference })
    .eq("reference", bookingReference);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await sendWhatsApp(`Payment received for ${bookingReference} — R${(verify.data.amount / 100).toLocaleString("en-US")}`);
  return NextResponse.json({ ok: true });
}
