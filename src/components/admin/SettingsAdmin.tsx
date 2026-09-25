"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Settings } from "@/lib/data";

const supabase = createClient();

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setSettings(data as Settings));
  }, []);

  async function save() {
    if (!settings) return;
    setStatus("saving");
    await supabase.from("site_settings").update(settings).eq("id", 1);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  if (!settings) return <p className="text-neutral-600">Loading settings…</p>;

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-neutral-600">Shown in the site header, footer and contact page.</p>
      <div className="mt-8 grid gap-4 rounded-lg border border-line bg-white p-6">
        <label className="text-sm font-medium">Phone
          <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-medium">Email
          <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-medium">Business hours
          <input value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm" />
        </label>
        <button onClick={save} disabled={status === "saving"} className="rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
