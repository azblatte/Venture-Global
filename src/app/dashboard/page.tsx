import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card, CardSubtitle, CardTitle, CardValue } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import PriceLineChart from "@/components/charts/PriceLineChart";
import SpreadAreaChart from "@/components/charts/SpreadAreaChart";
import FleetMap from "@/components/map/FleetMap";
import { getInsights, getPricingHistory, getTerminals, getVesselPositions, getVessels } from "@/lib/seed";
import { calculateSpreads, latestByBenchmark, SHIPPING_US_ASIA, SHIPPING_US_EU, REGAS_PROXY } from "@/lib/pricing";
import { computePulseScore } from "@/lib/pulse";
import { formatNumber } from "@/lib/utils";

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

export default async function DashboardPage() {
  const [pricing, vessels, positions, terminals, insights] = await Promise.all([
    getPricingHistory(),
    getVessels(),
    getVesselPositions(),
    getTerminals(),
    getInsights(),
  ]);

  const spreads = calculateSpreads(pricing);
  const latestSpreads = spreads[spreads.length - 1];
  const latestPrices = latestByBenchmark(pricing);
  const series = toChartSeries(pricing).slice(-60);
  const spreadSeries = spreads.slice(-60);
  const pulse = computePulseScore(spreads, vessels);
  const alertItems = insights
    .filter((item) => item.severity !== "INFO")
    .slice(0, 3);

  return (
    <PageShell>
      <Header title="Overview Dashboard" subtitle="Macro spreads, fleet utilization, and terminal momentum in one pane." />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Henry Hub</CardTitle>
          <CardValue>${formatNumber(latestPrices.get("HENRY_HUB")?.price ?? 0, { maximumFractionDigits: 2 })}</CardValue>
          <CardSubtitle>US feedgas benchmark</CardSubtitle>
        </Card>
        <Card>
          <CardTitle>TTF</CardTitle>
          <CardValue>${formatNumber(latestPrices.get("TTF")?.price ?? 0, { maximumFractionDigits: 2 })}</CardValue>
          <CardSubtitle>European hub pricing</CardSubtitle>
        </Card>
        <Card>
          <CardTitle>JKM</CardTitle>
          <CardValue>${formatNumber(latestPrices.get("JKM")?.price ?? 0, { maximumFractionDigits: 2 })}</CardValue>
          <CardSubtitle>Asian spot pricing</CardSubtitle>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>TTF - HH Spread</CardTitle>
          <CardValue>${formatNumber(latestSpreads?.ttfHhSpread ?? 0, { maximumFractionDigits: 2 })}</CardValue>
          <CardSubtitle>European netback window</CardSubtitle>
        </Card>
        <Card>
          <CardTitle>JKM - HH Spread</CardTitle>
          <CardValue>${formatNumber(latestSpreads?.jkmHhSpread ?? 0, { maximumFractionDigits: 2 })}</CardValue>
          <CardSubtitle>Asia netback window</CardSubtitle>
        </Card>
        <Card>
          <CardTitle>VG Pulse Score</CardTitle>
          <CardValue>{pulse.overall}</CardValue>
          <CardSubtitle>
            Spread {pulse.breakdown.spreadScore} · Fleet {pulse.breakdown.fleetScore}
          </CardSubtitle>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Macro Pricing Signals</CardTitle>
            <Badge tone="emerald">Last 60 days</Badge>
          </div>
          <PriceLineChart data={series} />
        </Card>
        <Card>
          <CardTitle>Netback Snapshot</CardTitle>
          <CardValue>
            Europe ${formatNumber(latestSpreads?.netbackEurope ?? 0, { maximumFractionDigits: 2 })}
          </CardValue>
          <CardSubtitle>
            Asia ${formatNumber(latestSpreads?.netbackAsia ?? 0, { maximumFractionDigits: 2 })}
          </CardSubtitle>
          <div className="mt-6 space-y-3 text-xs text-slate-500">
            <p>Shipping US→EU: ${SHIPPING_US_EU.toFixed(2)}</p>
            <p>Shipping US→Asia: ${SHIPPING_US_ASIA.toFixed(2)}</p>
            <p>Regas proxy: ${REGAS_PROXY.toFixed(2)}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
        <Card>
          <CardTitle>Spreads Momentum</CardTitle>
          <SpreadAreaChart
            data={spreadSeries.map((item) => ({
              date: item.date,
              ttfHhSpread: item.ttfHhSpread,
              jkmHhSpread: item.jkmHhSpread,
            }))}
          />
        </Card>
        <Card>
          <CardTitle>Fleet & Terminals Live Map</CardTitle>
          <CardSubtitle>Latest AIS positions vs VG terminals</CardSubtitle>
          <div className="mt-4">
            <FleetMap positions={positions} terminals={terminals} height="320px" />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardTitle>Latest Insights</CardTitle>
          <div className="mt-4 space-y-4">
            {insights.slice(0, 4).map((insight) => (
              <div key={`${insight.title}-${insight.date}`} className="rounded-xl border border-slate-200/60 bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
                  <Badge tone={insight.severity === "WARNING" ? "amber" : "slate"}>{insight.category}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500">{insight.body}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Top Alerts</CardTitle>
          <CardSubtitle>Signal-driven exceptions</CardSubtitle>
          <div className="mt-4 space-y-3">
            {alertItems.length === 0 ? (
              <p className="text-sm text-slate-500">No critical alerts right now.</p>
            ) : (
              alertItems.map((alert) => (
                <div key={alert.title} className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-3">
                  <p className="text-sm font-semibold text-amber-700">{alert.title}</p>
                  <p className="text-xs text-amber-700/80">{alert.date}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
