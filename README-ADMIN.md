# Admin section

URL: /admin (redirects to /admin/login if you're not signed in)

## One-time setup

1. Run the full `supabase/schema.sql` in the Supabase SQL editor (safe to
   re-run). This creates products, services, bookings, reviews, settings,
   the product-images storage bucket, and seeds your existing content.
2. In Supabase: **Authentication > Users > Add user** — create yourself a
   login (email + password). That's what you use at /admin/login. There's
   no public sign-up page on purpose.
3. Install the extra packages this update needs:
   `npm i @supabase/ssr`
4. Copy `.env.example` to `.env.local` and fill in every value — see below
   for where each one comes from. Add the same variables in Vercel
   (Project > Settings > Environment Variables) before you redeploy.

## What you can edit from /admin

- **Bookings** — every quote, service request and laptop order, each with
  its own reference (e.g. `LV-4F9K2`). Change status (Received → In
  progress → Completed → Cancelled), set/adjust the amount, and mark paid.
- **Products / Services** — as before: prices, photos, line items.
- **Reviews** — approve or delete client reviews before they show on
  the public `/reviews` page.
- **Analytics** — clients served and revenue, per service category and
  for laptop sales.
- **Settings** — phone, email, business hours.

## How clients use it

- **Booking:** every "Book" / "Order" / "Get a quote" button creates a
  booking and shows the client their reference number on-screen.
- **Tracking:** `/track` — a client enters their reference plus the email
  or phone they booked with, and sees a status timeline. Only their own
  booking is ever shown — this uses a Supabase function that checks
  reference *and* contact detail match before returning anything.
- **Collect/delivery:** once you mark a *repair* or *laptop order*
  "Completed" in Bookings, the client's `/track` page shows a choice
  between collecting in-store or delivery (with an address field). It's
  not shown for CCTV, IT support, or general quotes.
- **Paying:** if a booking has an amount set and isn't marked paid, a
  "Pay now" button appears on `/track`, powered by Paystack.
- **Reviewing:** `/reviews` — public reviews plus a submission form.
  New reviews are hidden until you approve them in the admin.

## WhatsApp notifications (Twilio)

You'll get a WhatsApp message on 082 049 9013 every time someone submits
a quote, books a service, orders a laptop, or completes a payment.

1. Create a free account at twilio.com and open the Console.
2. Twilio gives you an **Account SID** and **Auth Token** on the Console
   dashboard — these are `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`.
3. Go to **Messaging > Try it out > Send a WhatsApp message**. Twilio's
   sandbox number (usually `whatsapp:+14155238886`) is your
   `TWILIO_WHATSAPP_FROM`. Follow the on-screen instructions to join the
   sandbox from 082 049 9013 (send the given code via WhatsApp to that
   number) — until you do this, Twilio won't deliver messages to it.
4. Set `TWILIO_WHATSAPP_TO=whatsapp:+27820499013`.
5. **This sandbox is for testing only** — messages expire after 3 days
   and only pre-joined numbers can receive them. For a permanent setup,
   Twilio (or Meta directly) requires applying for a WhatsApp Business
   sender, which involves business verification and takes Meta a few
   days to approve. Do this before you rely on it for real bookings.
6. If these variables aren't set, the site still works — it just skips
   sending the WhatsApp message and logs a warning instead of erroring.

## Payments (Paystack)

1. Create an account at paystack.com and switch to **Test mode** first.
2. **Settings > API Keys & Webhooks** gives you a test **Public Key**
   (`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`) and **Secret Key**
   (`PAYSTACK_SECRET_KEY`).
3. Test a payment using Paystack's published test card numbers (search
   "Paystack test cards" in their docs) before going live.
4. When ready for real payments, switch Paystack to **Live mode** and
   swap in your live keys (`pk_live_...` / `sk_live_...`) in both
   `.env.local` and Vercel.
5. Payments are verified server-side (`/api/paystack/verify`) using your
   secret key before a booking is marked paid — the site never trusts
   the payment confirmation from the browser alone.

## Service role key — handle with care

`SUPABASE_SERVICE_ROLE_KEY` bypasses all of your database's security
rules. It's only ever used in server-side code (Server Actions and the
Paystack route) and must never be added with the `NEXT_PUBLIC_` prefix
or committed to Git. `.env.local` is already git-ignored.
