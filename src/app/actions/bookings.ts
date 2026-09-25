"use server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWhatsApp } from "@/lib/whatsapp";

function makeReference() {
  return `LV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function parseAmount(text: string): number | null {
  const match = text.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

type Result = { ok: true; reference: string } | { ok: false; error: string };

// General "get a quote" enquiry from the Contact page — no specific service or product.
export async function submitQuote(input: { name: string; email: string; phone?: string; service?: string; message?: string }): Promise<Result> {
  if (!input.name || !input.email) return { ok: false, error: "Name and email are required." };
  const supabase = createAdminClient();
  const reference = makeReference();
  const { error } = await supabase.from("bookings").insert({
    reference, type: "quote", name: input.name, email: input.email, phone: input.phone || null,
    service_item_name: input.service || null, message: input.message || null,
  });
  if (error) return { ok: false, error: error.message };
  await sendWhatsApp(
    `New quote request ${reference}\n${input.name} — ${input.phone || input.email}` +
    (input.service ? `\nService: ${input.service}` : "") +
    (input.message ? `\n"${input.message}"` : "")
  );
  return { ok: true, reference };
}

// Booking a specific service (e.g. "Screen Replacement" under Repairs).
export async function submitServiceBooking(input: { name: string; email: string; phone?: string; groupId: string; groupTitle: string; itemName: string; itemPrice: string; message?: string }): Promise<Result> {
  if (!input.name || !input.email) return { ok: false, error: "Name and email are required." };
  const supabase = createAdminClient();
  const reference = makeReference();
  const { error } = await supabase.from("bookings").insert({
    reference, type: "service", name: input.name, email: input.email, phone: input.phone || null,
    service_group_id: input.groupId, service_item_name: input.itemName,
    amount: parseAmount(input.itemPrice), message: input.message || null,
  });
  if (error) return { ok: false, error: error.message };
  await sendWhatsApp(`New booking ${reference}\n${input.name} — ${input.phone || input.email}\n${input.groupTitle}: ${input.itemName}`);
  return { ok: true, reference };
}

// Ordering a specific laptop.
export async function submitProductBooking(input: { name: string; email: string; phone?: string; productId: string; productName: string; amount: number }): Promise<Result> {
  if (!input.name || !input.email) return { ok: false, error: "Name and email are required." };
  const supabase = createAdminClient();
  const reference = makeReference();
  const { error } = await supabase.from("bookings").insert({
    reference, type: "product", name: input.name, email: input.email, phone: input.phone || null,
    product_id: input.productId, product_name: input.productName, amount: input.amount,
  });
  if (error) return { ok: false, error: error.message };
  await sendWhatsApp(`New laptop order ${reference}\n${input.name} — ${input.phone || input.email}\n${input.productName} — R${input.amount.toLocaleString("en-US")}`);
  return { ok: true, reference };
}
