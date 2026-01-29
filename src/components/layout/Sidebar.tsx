"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/fleet", label: "Fleet Tracker" },
  { href: "/terminals", label: "Terminals" },
  { href: "/pricing", label: "Pricing Lab" },
  { href: "/contracts", label: "SPA Contracts" },
  { href: "/news", label: "News & Events" },
  { href: "/insights", label: "Insights" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-200/60 bg-white/65 px-6 py-8 backdrop-blur-xl lg:flex">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">VG Control Tower</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Command Center</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl bg-slate-900/90 p-4 text-xs text-slate-200">
        <p className="font-semibold text-white">VG Pulse</p>
        <p className="mt-2 text-slate-300">Signal-driven view of fleet, terminals, and macro spreads.</p>
      </div>
    </aside>
  );
}
