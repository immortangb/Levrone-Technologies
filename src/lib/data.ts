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

export type BookingStatus = "received" | "in_progress" | "completed" | "cancelled";
export type Fulfillment = "collect" | "delivery";
export type Booking = {
  id: string;
  reference: string;
  type: "quote" | "service" | "product";
  name: string;
  email: string;
  phone: string | null;
  service_group_id: ServiceGroup["id"] | null;
  service_item_name: string | null;
  product_id: string | null;
  product_name: string | null;
  message: string | null;
  amount: number | null;
  status: BookingStatus;
  fulfillment: Fulfillment | null;
  delivery_address: string | null;
  paid: boolean;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
};

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

export const statusLabels: Record<BookingStatus, string> = {
  received: "Received",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Collect/delivery only makes sense for a physical device — a repair job
// or a laptop order, not CCTV, support hours, or a general quote.
// service_group_id is typed loosely (string, not the union) because it
// often arrives straight from a database row rather than typed app state.
export function eligibleForFulfillment(b: { type: Booking["type"]; service_group_id: string | null }) {
  return b.type === "product" || (b.type === "service" && b.service_group_id === "repairs");
}
