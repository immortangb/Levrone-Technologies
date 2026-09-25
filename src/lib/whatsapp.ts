// Sends a WhatsApp message to the business owner via Twilio's WhatsApp API.
// Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM and
// TWILIO_WHATSAPP_TO to be set — see README-ADMIN.md. If they're missing,
// this quietly skips instead of breaking the booking flow.
export async function sendWhatsApp(message: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.TWILIO_WHATSAPP_TO;
  if (!sid || !token || !from || !to) {
    console.warn("[whatsapp] Not configured — skipping notification.");
    return;
  }
  try {
    const body = new URLSearchParams({ From: from, To: to, Body: message });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) console.error("[whatsapp] send failed:", await res.text());
  } catch (err) {
    console.error("[whatsapp] send error:", err);
  }
}
