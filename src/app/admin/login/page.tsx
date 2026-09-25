"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const d = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(d.get("email")),
      password: String(d.get("password")),
    });
    setLoading(false);
    if (error) return setError("Incorrect email or password.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <p className="font-serif text-2xl font-semibold">Admin sign in</p>
        <p className="mt-1 text-sm text-neutral-600">Levrone Technologies</p>
        <label className="mt-6 block text-sm font-medium">Email
          <input name="email" type="email" required className="mt-1.5 w-full rounded-md border border-line px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink" />
        </label>
        <label className="mt-4 block text-sm font-medium">Password
          <input name="password" type="password" required className="mt-1.5 w-full rounded-md border border-line px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink" />
        </label>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
