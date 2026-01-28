import { format } from "date-fns";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Venture Global LNG</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
        {format(new Date(), "EEEE, MMMM d, yyyy")}
      </div>
    </div>
  );
}
