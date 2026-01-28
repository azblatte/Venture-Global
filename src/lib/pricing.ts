import type { PricePoint, SpreadPoint } from "@/types/pricing";

export const SHIPPING_US_EU = 1.3;
export const SHIPPING_US_ASIA = 3.0;
export const REGAS_PROXY = 0.5;

export function calculateSpreads(prices: PricePoint[]): SpreadPoint[] {
  const byDate = new Map<string, { hh?: number; ttf?: number; jkm?: number }>();
  for (const point of prices) {
    const entry = byDate.get(point.date) ?? {};
    if (point.benchmark === "HENRY_HUB") entry.hh = point.price;
    if (point.benchmark === "TTF") entry.ttf = point.price;
    if (point.benchmark === "JKM") entry.jkm = point.price;
    byDate.set(point.date, entry);
  }

  const output: SpreadPoint[] = [];
  for (const [date, entry] of byDate.entries()) {
    if (entry.hh === undefined || entry.ttf === undefined || entry.jkm === undefined) continue;
    const ttfHh = Number((entry.ttf - entry.hh).toFixed(2));
    const jkmHh = Number((entry.jkm - entry.hh).toFixed(2));
    output.push({
      date,
      ttfHhSpread: ttfHh,
      jkmHhSpread: jkmHh,
      netbackEurope: Number((entry.ttf - SHIPPING_US_EU - REGAS_PROXY).toFixed(2)),
      netbackAsia: Number((entry.jkm - SHIPPING_US_ASIA - REGAS_PROXY).toFixed(2)),
    });
  }

  return output.sort((a, b) => a.date.localeCompare(b.date));
}

export function latestByBenchmark(prices: PricePoint[]) {
  const latest = new Map<string, PricePoint>();
  for (const point of prices) {
    const existing = latest.get(point.benchmark);
    if (!existing || point.date > existing.date) {
      latest.set(point.benchmark, point);
    }
  }
  return latest;
}
