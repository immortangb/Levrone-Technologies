"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const supabase = createClient();

type Enquiry = { id: string; name: string; email: string; phone: string | null; service: string | null; message: string | null; created_at: string };

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setEnquiries((data as Enquiry[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    await supabase.from("enquiries").delete().eq("id", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) return <p className="text-neutral-600">Loading enquiries…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Enquiries</h1>
      <p className="mt-2 text-neutral-600">Messages sent through the contact form, newest first.</p>
      <div className="mt-8 grid gap-4">
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{e.name} <span className="font-normal text-neutral-500">· {e.email}</span></p>
                {e.phone && <p className="text-sm text-neutral-500">{e.phone}</p>}
                {e.service && <p className="mt-1 inline-block rounded-full bg-paper px-3 py-1 text-xs">{e.service}</p>}
              </div>
              <div className="text-right text-xs text-neutral-400">
                <p>{new Date(e.created_at).toLocaleString("en-ZA")}</p>
                <button onClick={() => remove(e.id)} className="mt-1 text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            {e.message && <p className="mt-3 text-sm text-neutral-700">{e.message}</p>}
          </div>
        ))}
        {enquiries.length === 0 && <p className="text-neutral-600">No enquiries yet.</p>}
      </div>
    </div>
  );
}
