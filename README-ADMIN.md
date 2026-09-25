# Admin section

URL: /admin (redirects to /admin/login if you're not signed in)

## One-time setup
1. Run the full supabase/schema.sql in the Supabase SQL editor (safe to
   re-run). This creates the products, service_groups, service_items,
   site_settings and enquiries tables, the product-images storage bucket,
   and seeds your existing content so the admin isn't empty on first load.
2. In Supabase: Authentication > Users > Add user. Create yourself an
   account with an email and password — this is what you'll log in with
   at /admin/login. There's no public sign-up page on purpose.
3. `npm i @supabase/ssr` (in addition to the packages from before).

## What you can edit
- **Products** — name, brand, specs, display size, price, and photo
  (upload replaces the placeholder immediately). Add or delete laptops.
- **Services** — the title and description of each of the 4 categories,
  and every line item's name and price inside them. Add or remove lines.
- **Settings** — phone, email, business hours shown in the header,
  footer and contact page.
- **Enquiries** — read and delete messages sent through the contact form.

Everything saves straight to Supabase, so the live site updates without
a redeploy.
