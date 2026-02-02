import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import PriceLineChart from "@/components/charts/PriceLineChart";
import SpreadAreaChart from "@/components/charts/SpreadAreaChart";
import { getPricingHistory, getMeta } from "@/lib/seed";
import { calculateSpreads, latestByBenchmark, SHIPPING_US_EU, SHIPPING_US_ASIA } from "@/lib/pricing";
import { RefreshButton } from "@/components/ui/RefreshButton";
import LivePriceWidgets from "@/components/charts/LivePriceWidgets";

// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

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

// VG operating cost per MMBtu
const VG_OPERATING_COST = 0.69;
const VG_LIQUEFACTION_FEE = 2.0;

export default async function PricingPage() {
  const [pricing, meta] = await Promise.all([getPricingHistory(), getMeta()]);
  const spreads = calculateSpreads(pricing);
  const series = toChartSeries(pricing).slice(-90);
  const spreadSeries = spreads.slice(-90);
  const latest = latestByBenchmark(pricing);

  const hh = latest.get("HENRY_HUB")?.price ?? 0;
  const ttf = latest.get("TTF")?.price ?? 0;
  const jkm = latest.get("JKM")?.price ?? 0;

  const ttfSpread = ttf - hh;
  const jkmSpread = jkm - hh;

  const spotMarginEurope = ttf - hh - SHIPPING_US_EU - VG_OPERATING_COST;
  const spotMarginAsia = jkm - hh - SHIPPING_US_ASIA - VG_OPERATING_COST;
  const contractMargin = VG_LIQUEFACTION_FEE - VG_OPERATING_COST;

  return (
    <PageShell>
      <Header
        title="Pricing & Spreads"
        subtitle="VG buys gas at Henry Hub, sells globally at TTF/JKM. The spread is the opportunity."
      />

      <section>
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Data Source</p>
              <p className="text-xs text-slate-500">
                Showing seed data. To enable live updates, add EIA_API_KEY to .env
              </p>
              <a
                href="https://www.eia.gov/opendata/register.php"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
              >
                Get free EIA API key →
              </a>
            </div>
            <RefreshButton lastUpdated={meta.lastPriceUpdate} source={meta.source} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Henry Hub (US Gas)</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">${hh.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-500">VG feedstock cost</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">TTF (Europe)</p>
          <p className="mt-2 text-4xl font-semibold text-sky-600">${ttf.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-500">European benchmark</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">JKM (Asia)</p>
          <p className="mt-2 text-4xl font-semibold text-orange-500">${jkm.toFixed(2)}</p>
          <p className="mt-1 text-xs text-slate-500">Asian benchmark</p>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">TTF - HH Spread</p>
          <p className={`mt-2 text-4xl font-semibold ${ttfSpread > 4 ? "text-emerald-600" : ttfSpread > 0 ? "text-amber-600" : "text-red-600"}`}>
            ${ttfSpread.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Europe arbitrage ($/MMBtu)</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">JKM - HH Spread</p>
          <p className={`mt-2 text-4xl font-semibold ${jkmSpread > 4 ? "text-emerald-600" : jkmSpread > 0 ? "text-amber-600" : "text-red-600"}`}>
            ${jkmSpread.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Asia arbitrage ($/MMBtu)</p>
        </Card>
      </section>

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">VG Margin Analysis</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Spot Margin (Europe)</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">${spotMarginEurope.toFixed(2)}/MMBtu</p>
              <p className="mt-1 text-xs text-emerald-600">TTF - HH - Shipping - OpEx</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-700">Spot Margin (Asia)</p>
              <p className="mt-2 text-2xl font-semibold text-orange-700">${spotMarginAsia.toFixed(2)}/MMBtu</p>
              <p className="mt-1 text-xs text-orange-600">JKM - HH - Shipping - OpEx</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">Contract Margin</p>
              <p className="mt-2 text-2xl font-semibold text-slate-700">${contractMargin.toFixed(2)}/MMBtu</p>
              <p className="mt-1 text-xs text-slate-500">Liq Fee ($2.00) - OpEx ($0.69)</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Spot sales capture the full TTF/JKM-HH spread minus costs. Contract sales earn the stable liquefaction fee regardless of global prices.
            VG maximizes commissioning spot sales when spreads are high.
          </p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Price History (90 days)</h3>
          <PriceLineChart data={series} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Spread Dynamics</h3>
          <SpreadAreaChart data={spreadSeries} />
        </Card>
      </section>

      <LivePriceWidgets />

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Reference</h3>
          <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-slate-800">Henry Hub</p>
              <p className="text-xs text-slate-500">US gas benchmark. VG feedstock cost.</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">TTF (Europe)</p>
              <p className="text-xs text-slate-500">Dutch gas hub. Primary European price.</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">JKM (Asia)</p>
              <p className="text-xs text-slate-500">Japan-Korea Marker. Asian LNG spot price.</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">Spread &gt; $4</p>
              <p className="text-xs text-slate-500">Strong margin. US LNG very profitable.</p>
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
