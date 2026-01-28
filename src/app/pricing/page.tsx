import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import PriceLineChart from "@/components/charts/PriceLineChart";
import SpreadAreaChart from "@/components/charts/SpreadAreaChart";
import NetbackBarChart from "@/components/charts/NetbackBarChart";
import { getPricingHistory } from "@/lib/seed";
import { calculateSpreads } from "@/lib/pricing";

function toChartSeries(pricing: Awaited<ReturnType<typeof getPricingHistory>>) {
  const map = new Map<string, { date: string; HENRY_HUB: number; TTF: number; JKM: number }>();
  for (const point of pricing) {
    const entry = map.get(point.date) ?? { date: point.date, HENRY_HUB: 0, TTF: 0, JKM: 0 };
    if (point.benchmark === "HENRY_HUB") entry.HENRY_HUB = point.price;
    if (point.benchmark === "TTF") entry.TTF = point.price;
    if (point.benchmark === "JKM") entry.JKM = point.price;
    map.set(point.date, entry);
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export default async function PricingPage() {
  const pricing = await getPricingHistory();
  const spreads = calculateSpreads(pricing);
  const series = toChartSeries(pricing).slice(-90);
  const spreadSeries = spreads.slice(-90);

  return (
    <PageShell>
      <Header title="Pricing & Spreads Lab" subtitle="Daily HH, TTF, JKM history with inferred netbacks." />

      <section className="grid gap-6">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Benchmark Curve</h3>
          <p className="mt-2 text-sm text-slate-500">Last 90 days seeded series.</p>
          <PriceLineChart data={series} />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Spread Dynamics</h3>
          <SpreadAreaChart data={spreadSeries} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Netback Comparison</h3>
          <NetbackBarChart data={spreadSeries.slice(-14)} />
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Arbitrage Readout</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Margin Driver</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">TTF premium</p>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Likely Basin</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">Atlantic bias</p>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Risk Flag</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">Spread compression</p>
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
