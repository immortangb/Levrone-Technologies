import Link from "next/link";

const cards = [
  ["Bookings", "/admin/bookings", "See every quote, service request and laptop order — update status, amount and payment."],
  ["Products", "/admin/products", "Add, edit, price and upload photos for the laptops you sell."],
  ["Services", "/admin/services", "Edit the repairs, sales, CCTV and support price lists."],
  ["Reviews", "/admin/reviews", "Approve or remove client reviews before they go live."],
  ["Analytics", "/admin/analytics", "Clients served and revenue, broken down by service and product."],
  ["Settings", "/admin/settings", "Update the phone number, email and business hours shown on the site."],
] as const;

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-neutral-600">Changes here go live on the site immediately.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(([title, href, blurb]) => (
          <Link key={href} href={href} className="rounded-lg border border-line bg-white p-6 hover:border-ink">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-neutral-600">{blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
