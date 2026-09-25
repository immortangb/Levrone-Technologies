export type ServiceItem = { id: string; name: string; price: string; sort_order?: number };
export type ServiceGroup = {
  id: "repairs" | "sales" | "cctv" | "support";
  title: string;
  blurb: string;
  items: ServiceItem[];
};
export type Product = {
  id: string;
  name: string;
  brand: string;
  specs: string;
  display: string;
  price: number;
  image: string;
  sort_order?: number;
};
export type Settings = { phone: string; email: string; hours: string };

// Fallback used only if the database has no rows yet (e.g. schema.sql
// hasn't been run) so the site never shows a broken empty page.
export const fallbackSettings: Settings = {
  phone: "082 049 9013",
  email: "brian@levronetech.co.za",
  hours: "Mon–Fri, 08:00–16:00",
};

export const reasons = [
  ["Expert technicians", "Certified professionals with years of hands-on experience."],
  ["Quality parts", "Genuine, high-quality replacement parts for every repair."],
  ["Fast turnaround", "Most repairs are completed within 24–48 hours."],
  ["Fair pricing", "Transparent, competitive rates with no hidden costs."],
  ["Warranty protection", "All work is backed by a warranty."],
];
