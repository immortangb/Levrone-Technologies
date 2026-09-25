-- Run this whole file in Supabase: SQL Editor > New query > Run.
-- Safe to re-run: it drops and recreates policies/functions, and only seeds empty tables.
-- Your old "enquiries" table (if you ran an earlier version of this file) is
-- no longer used by the site — everything now goes through "bookings".
-- You can drop it manually later: drop table if exists public.enquiries;

-- ---------- Products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  specs text not null default '',
  display text not null default '',
  price numeric not null default 0,
  image text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products" on public.products for select to anon, authenticated using (true);
drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products for all to authenticated using (true) with check (true);

-- ---------- Services: groups + items ----------
create table if not exists public.service_groups (
  id text primary key,
  title text not null,
  blurb text not null default '',
  sort_order int not null default 0
);
alter table public.service_groups enable row level security;
drop policy if exists "Anyone can view service groups" on public.service_groups;
create policy "Anyone can view service groups" on public.service_groups for select to anon, authenticated using (true);
drop policy if exists "Admins can manage service groups" on public.service_groups;
create policy "Admins can manage service groups" on public.service_groups for all to authenticated using (true) with check (true);

create table if not exists public.service_items (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references public.service_groups(id) on delete cascade,
  name text not null,
  price text not null default 'Quote Based',
  sort_order int not null default 0
);
alter table public.service_items enable row level security;
drop policy if exists "Anyone can view service items" on public.service_items;
create policy "Anyone can view service items" on public.service_items for select to anon, authenticated using (true);
drop policy if exists "Admins can manage service items" on public.service_items;
create policy "Admins can manage service items" on public.service_items for all to authenticated using (true) with check (true);

-- ---------- Site settings (single row) ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '',
  email text not null default '',
  hours text not null default ''
);
alter table public.site_settings enable row level security;
drop policy if exists "Anyone can view settings" on public.site_settings;
create policy "Anyone can view settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can manage settings" on public.site_settings;
create policy "Admins can manage settings" on public.site_settings for all to authenticated using (true) with check (true);

insert into public.site_settings (id, phone, email, hours)
values (1, '082 049 9013', 'brian@levronetech.co.za', 'Mon–Fri, 08:00–16:00')
on conflict (id) do nothing;

-- ---------- Storage bucket for product images ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images');
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

-- ---------- Bookings (quotes, service requests, product orders) ----------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  type text not null check (type in ('quote','service','product')),
  name text not null,
  email text not null,
  phone text,
  service_group_id text references public.service_groups(id),
  service_item_name text,
  product_id uuid references public.products(id),
  product_name text,
  message text,
  amount numeric,
  status text not null default 'received' check (status in ('received','in_progress','completed','cancelled')),
  fulfillment text check (fulfillment in ('collect','delivery')),
  delivery_address text,
  paid boolean not null default false,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
-- No anon insert/select policy on the table itself: creating a booking goes
-- through a server action (service-role key, never exposed to the browser),
-- and clients look their own booking up only through the function below.
-- This stops anyone from listing or editing other people's bookings.
drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings" on public.bookings for all to authenticated using (true) with check (true);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- A client looks up their own booking with the reference PLUS the email or
-- phone they booked with — this is why it's a function, not a public
-- select policy: it proves they own the booking without exposing anyone else's.
create or replace function public.get_booking_status(p_reference text, p_contact text)
returns table (
  reference text, type text, status text, fulfillment text, delivery_address text,
  amount numeric, paid boolean, service_item_name text, product_name text,
  created_at timestamptz, updated_at timestamptz
)
language sql security definer set search_path = public as $$
  select reference, type, status, fulfillment, delivery_address, amount, paid,
         service_item_name, product_name, created_at, updated_at
  from public.bookings
  where reference = p_reference and (email = p_contact or phone = p_contact)
  limit 1;
$$;
grant execute on function public.get_booking_status(text, text) to anon, authenticated;

-- Collect/delivery is only settable once the job is completed, and only for
-- repairs or a laptop purchase — enforced here, not just in the UI.
create or replace function public.set_booking_fulfillment(p_reference text, p_contact text, p_fulfillment text, p_address text default null)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_status text; v_type text; v_group text;
begin
  select status, type, service_group_id into v_status, v_type, v_group
    from public.bookings where reference = p_reference and (email = p_contact or phone = p_contact);
  if not found then return false; end if;
  if v_status <> 'completed' then return false; end if;
  if not (v_type = 'product' or (v_type = 'service' and v_group = 'repairs')) then return false; end if;
  if p_fulfillment not in ('collect','delivery') then return false; end if;
  update public.bookings set fulfillment = p_fulfillment, delivery_address = p_address
    where reference = p_reference;
  return true;
end; $$;
grant execute on function public.set_booking_fulfillment(text, text, text, text) to anon, authenticated;

-- ---------- Reviews ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) <= 1000),
  service_group_id text references public.service_groups(id),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "Anyone can submit a review" on public.reviews;
create policy "Anyone can submit a review" on public.reviews for insert to anon with check (true);
drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews" on public.reviews for select to anon using (approved = true);
drop policy if exists "Admins can view all reviews" on public.reviews;
create policy "Admins can view all reviews" on public.reviews for select to authenticated using (true);
drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews" on public.reviews for update to authenticated using (true) with check (true);
drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews" on public.reviews for delete to authenticated using (true);

-- ---------- Seed content (only runs if the tables are still empty) ----------
insert into public.service_groups (id, title, blurb, sort_order)
select * from (values
  ('repairs', 'Laptop & Desktop Repairs', 'Screen replacement, battery issues, keyboard repairs, motherboard fixes and hardware upgrades.', 1),
  ('sales', 'Laptop Sales', 'New and refurbished laptops from Apple, HP, Dell, Lenovo, Asus and more.', 2),
  ('cctv', 'CCTV Installation', 'Security camera installation for homes and businesses, with full setup and configuration.', 3),
  ('support', 'IT Support & Advice', 'Technical support, system optimization, virus removal and expert IT consultation.', 4)
) as v(id, title, blurb, sort_order)
where not exists (select 1 from public.service_groups);

insert into public.service_items (group_id, name, price, sort_order)
select * from (values
  ('repairs','Screen Replacement','From R750',1),('repairs','Battery Replacement','From R450',2),
  ('repairs','Keyboard Replacement','From R350',3),('repairs','Motherboard Repairs','From R1500',4),
  ('repairs','Broken Hinges Fix','From R350',5),('repairs','Case Replacement','From R550',6),
  ('repairs','RAM Upgrade','From R350',7),('repairs','Storage Upgrade (SSD)','From R750',8),
  ('repairs','Network Adapter Repair','From R450',9),('repairs','OS Installation (Win/Mac/Linux)','From R350',10),
  ('repairs','Virus Removal','From R350',11),('repairs','Password Removal','From R350',12),
  ('repairs','Speed Optimization','From R350',13),('repairs','Software Installation','From R250',14),
  ('repairs','Troubleshooting','From R350',15),
  ('sales','Apple MacBook','From R18,999',1),('sales','HP Laptops','From R8,999',2),
  ('sales','Dell Laptops','From R9,499',3),('sales','Lenovo Laptops','From R8,499',4),
  ('sales','Asus Laptops','From R7,999',5),('sales','Acer Laptops','From R6,999',6),
  ('sales','MSI Laptops','From R12,499',7),('sales','Refurbished Options','From R4,499',8),
  ('sales','Custom PC Builds','Quote Based',9),('sales','Warranty Included','1–2 Years',10),
  ('cctv','Home CCTV Package (2 cameras)','From R2,500',1),('cctv','Home CCTV Package (4 cameras)','From R4,500',2),
  ('cctv','Business CCTV Package (8 cameras)','From R8,500',3),('cctv','HD Camera Installation','From R850/cam',4),
  ('cctv','IP Camera Setup','From R1,200/cam',5),('cctv','DVR/NVR Configuration','From R1,500',6),
  ('cctv','Remote Viewing Setup','From R750',7),('cctv','Motion Detection Setup','From R500',8),
  ('cctv','CCTV Maintenance','From R450',9),('cctv','System Upgrades','Quote Based',10),
  ('support','Remote Support','From R250/hr',1),('support','On-site Support','From R450/hr',2),
  ('support','Network Setup','From R1,200',3),('support','WiFi Optimization','From R650',4),
  ('support','Data Backup Solutions','From R450',5),('support','Data Recovery','From R1,500',6),
  ('support','Email Setup','From R350',7),('support','Printer Setup','From R450',8),
  ('support','IT Consultation','From R500/hr',9),('support','Business IT Solutions','Quote Based',10),
  ('support','Server Maintenance','From R2,500',11),('support','Cloud Migration','Quote Based',12)
) as v(group_id, name, price, sort_order)
where not exists (select 1 from public.service_items);

insert into public.products (name, brand, specs, display, price, image, sort_order)
select * from (values
  ('MacBook Air M2','Apple','Apple M2 · 8GB · 256GB SSD','13.6" display',18999,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=MacBook+Air+M2',1),
  ('HP Pavilion 15','HP','Intel i5 · 16GB · 512GB SSD','15.6" display',12499,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=HP+Pavilion+15',2),
  ('Dell Inspiron 15','Dell','Intel i5 · 8GB · 256GB SSD','15.6" display',11999,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=Dell+Inspiron+15',3),
  ('Lenovo IdeaPad 5','Lenovo','Intel i5 · 16GB · 512GB SSD','14" display',10999,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=Lenovo+IdeaPad+5',4),
  ('Asus VivoBook 15','Asus','Intel i3 · 8GB · 256GB SSD','15.6" display',9499,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=Asus+VivoBook+15',5),
  ('Acer Aspire 5','Acer','Intel i3 · 8GB · 256GB SSD','15.6" display',8999,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=Acer+Aspire+5',6),
  ('MSI Modern 15','MSI','Intel i7 · 16GB · 512GB SSD','15.6" display',13499,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=MSI+Modern+15',7),
  ('MacBook Pro 14','Apple','Apple M1 Pro · 16GB · 512GB SSD','14" display',28999,'https://placehold.co/640x480/ece3d1/2b2420?font=source-serif-pro&text=MacBook+Pro+14',8)
) as v(name, brand, specs, display, price, image, sort_order)
where not exists (select 1 from public.products);
