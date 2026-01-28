import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_12px_40px_-25px_rgba(15,23,42,0.35)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-sm font-semibold uppercase tracking-[0.22em] text-slate-400", className)}>{children}</h3>;
}

export function CardValue({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-3 text-3xl font-semibold text-slate-900", className)}>{children}</p>;
}

export function CardSubtitle({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-2 text-sm text-slate-500", className)}>{children}</p>;
}
