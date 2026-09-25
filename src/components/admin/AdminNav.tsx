"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Services", "/admin/services"],
  ["Enquiries", "/admin/enquiries"],
  ["Settings", "/admin/settings"],
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-serif text-lg font-semibold">Levrone Admin</span>
          <nav className="flex flex-wrap gap-5 text-sm">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "font-semibold text-ink" : "text-neutral-500 hover:text-ink"}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-neutral-500 hover:text-ink">View site ↗</Link>
          <button onClick={signOut} className="rounded-full border border-line px-4 py-1.5 hover:border-ink">Sign out</button>
        </div>
      </div>
    </header>
  );
}
