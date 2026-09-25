-- Run this whole file in Supabase: SQL Editor > New query > Run.
-- Safe to re-run: it drops and recreates policies, and only seeds empty tables.

-- ---------- Contact form submissions ----------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 30),
  service text check (char_length(service) <= 100),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry" on public.enquiries for insert to anon with check (true);
drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries" on public.enquiries for select to authenticated using (true);
drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries" on public.enquiries for delete to authenticated using (true);

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
-- If this insert errors in the SQL editor, create it manually instead:
-- Storage > New bucket > name "product-images" > toggle Public on.
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
  ('MacBook Air M2','Apple','Apple M2 · 8GB · 256GB SSD','13.6" display',18999,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=MacBook+Air+M2',1),
  ('HP Pavilion 15','HP','Intel i5 · 16GB · 512GB SSD','15.6" display',12499,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=HP+Pavilion+15',2),
  ('Dell Inspiron 15','Dell','Intel i5 · 8GB · 256GB SSD','15.6" display',11999,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=Dell+Inspiron+15',3),
  ('Lenovo IdeaPad 5','Lenovo','Intel i5 · 16GB · 512GB SSD','14" display',10999,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=Lenovo+IdeaPad+5',4),
  ('Asus VivoBook 15','Asus','Intel i3 · 8GB · 256GB SSD','15.6" display',9499,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=Asus+VivoBook+15',5),
  ('Acer Aspire 5','Acer','Intel i3 · 8GB · 256GB SSD','15.6" display',8999,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=Acer+Aspire+5',6),
  ('MSI Modern 15','MSI','Intel i7 · 16GB · 512GB SSD','15.6" display',13499,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=MSI+Modern+15',7),
  ('MacBook Pro 14','Apple','Apple M1 Pro · 16GB · 512GB SSD','14" display',28999,'https://placehold.co/640x480/f5f5f4/171717?font=source-serif-pro&text=MacBook+Pro+14',8)
) as v(name, brand, specs, display, price, image, sort_order)
where not exists (select 1 from public.products);
