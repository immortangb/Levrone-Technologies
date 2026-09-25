"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Booking, ServiceGroup } from "@/lib/data";

const supabase = createClient();

type Row = { label: string; bookings: number; clients: number; revenue: number };

export default function AnalyticsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("bookings").select("*"),
      supabase.from("service_groups").select("*"),
    ]).then(([b, g]) => {
      setBookings((b.data as Booking[]) ?? []);
      setGroups((g.data as ServiceGroup[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-neutral-600">Loading analytics…</p>;

  const totalClients = new Set(bookings.map((b) => b.email.toLowerCase())).size;
  const totalRevenue = bookings.filter((b) => b.paid).reduce((s, b) => s + Number(b.amount || 0), 0);
  const pipelineValue = bookings.filter((b) => !b.paid && b.status !== "cancelled").reduce((s, b) => s + Number(b.amount || 0), 0);

  const rows: Row[] = [
    ...groups.map((g): Row => {
      const rel = bookings.filter((b) => b.type === "service" && b.service_group_id === g.id);
      return { label: g.title, bookings: rel.length, clients: new Set(rel.map((b) => b.email.toLowerCase())).size, revenue: rel.filter((b) => b.paid).reduce((s, b) => s + Number(b.amount || 0), 0) };
    }),
    (() => {
      const rel = bookings.filter((b) => b.type === "product");
      return { label: "Laptop sales", bookings: rel.length, clients: new Set(rel.map((b) => b.email.toLowerCase())).size, revenue: rel.filter((b) => b.paid).reduce((s, b) => s + Number(b.amount || 0), 0) };
    })(),
    (() => {
      const rel = bookings.filter((b) => b.type === "quote");
      return { label: "General quotes", bookings: rel.length, clients: new Set(rel.map((b) => b.email.toLowerCase())).size, revenue: 0 };
    })(),
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Analytics</h1>
      <p className="mt-2 text-neutral-600">Revenue counts bookings marked "Paid" in Bookings.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-white p-5"><p className="text-xs text-neutral-500">Total clients</p><p className="mt-1 font-serif text-2xl font-semibold">{totalClients}</p></div>
        <div className="rounded-lg border border-line bg-white p-5"><p className="text-xs text-neutral-500">Revenue (paid)</p><p className="mt-1 font-serif text-2xl font-semibold">R{totalRevenue.toLocaleString("en-US")}</p></div>
        <div className="rounded-lg border border-line bg-white p-5"><p className="text-xs text-neutral-500">Unpaid pipeline</p><p className="mt-1 font-serif text-2xl font-semibold">R{pipelineValue.toLocaleString("en-US")}</p></div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Bookings</th><th className="px-4 py-3">Clients</th><th className="px-4 py-3">Revenue</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="px-4 py-3 font-medium">{r.label}</td>
                <td className="px-4 py-3">{r.bookings}</td>
                <td className="px-4 py-3">{r.clients}</td>
                <td className="px-4 py-3 font-mono">R{r.revenue.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
