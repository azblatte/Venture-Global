import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "emerald" | "amber" | "rose" | "sky" }) {
  const toneClasses = {
    slate: "bg-slate-100 text-slate-600",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    sky: "bg-sky-100 text-sky-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", toneClasses[tone])}>
      {children}
    </span>
  );
}
