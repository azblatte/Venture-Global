import { startOfWeek } from "date-fns";
import type { PricePoint } from "@/types/pricing";
import type { SiteMeta } from "@/lib/seed";

export interface WeeklyLNGSnapshot {
  week: string;
  usTotalCargoes: number;
  vgTotalCargoes: number;
  plaqueminesCargoes: number;
  calcasieuCargoes: number;
  hh: number;
  ttf: number;
  jkm: number;
  ttfHh: number;
  jkmHh: number;
  profitabilityFlag: boolean;
  isRealCargo: boolean;
}

export interface LNGDashboardKpis {
  hh: number;
  ttf: number;
  jkm: number;
  ttfHh: number;
  jkmHh: number;
  weeklyVgCargoes: number;
  yoyVgGrowthPct: number;
}

export interface LNGDashboardData {
  meta: SiteMeta;
  kpis: LNGDashboardKpis;
  weekly: WeeklyLNGSnapshot[];
  table: WeeklyLNGSnapshot[];
  cargoSource: string;
  cargoCoveragePct: number;
}

interface WeeklyAggregate {
  sumHH: number;
  countHH: number;
  sumTTF: number;
  countTTF: number;
  sumJKM: number;
  countJKM: number;
}

export interface WeeklyCargoRecord {
  week: string;
  usTotalCargoes: number;
  plaqueminesCargoes: number;
  calcasieuCargoes: number;
  source: string;
}

function toWeekKey(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return start.toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pseudoNoise(index: number) {
  const raw = Math.sin(index * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

export function buildLNGDashboardData(
  pricing: PricePoint[],
  meta: SiteMeta,
  cargoWeekly: WeeklyCargoRecord[] = []
): LNGDashboardData {
  const weeklyMap = new Map<string, WeeklyAggregate>();

  for (const point of pricing) {
    const week = toWeekKey(point.date);
    const entry = weeklyMap.get(week) ?? {
      sumHH: 0,
      countHH: 0,
      sumTTF: 0,
      countTTF: 0,
      sumJKM: 0,
      countJKM: 0,
    };

    if (point.benchmark === "HENRY_HUB") {
      entry.sumHH += point.price;
      entry.countHH += 1;
    }
    if (point.benchmark === "TTF") {
      entry.sumTTF += point.price;
      entry.countTTF += 1;
    }
    if (point.benchmark === "JKM") {
      entry.sumJKM += point.price;
      entry.countJKM += 1;
    }

    weeklyMap.set(week, entry);
  }

  const weeks = Array.from(weeklyMap.keys()).sort();
  const weeklyPricing = weeks.map((week) => {
    const entry = weeklyMap.get(week)!;
    return {
      week,
      hh: entry.countHH ? entry.sumHH / entry.countHH : 0,
      ttf: entry.countTTF ? entry.sumTTF / entry.countTTF : 0,
      jkm: entry.countJKM ? entry.sumJKM / entry.countJKM : 0,
    };
  });

  const cargoMap = new Map(cargoWeekly.map((item) => [item.week, item]));
  const weekly: WeeklyLNGSnapshot[] = weeklyPricing.map((price, index) => {
    const seasonal = Math.sin((index / 52) * Math.PI * 2) * 4;
    const trend = index * 0.05;
    const noise = pseudoNoise(index) * 3;
    const modeledUsTotal = clamp(Math.round(30 + seasonal + trend + noise), 12, 50);

    const vgShare = 0.15 + 0.03 * Math.sin(index / 13);
    const modeledVgTotal = clamp(Math.round(modeledUsTotal * vgShare + 1), 2, 16);

    const date = new Date(`${price.week}T00:00:00Z`);
    const plaqueminesRatio = date < new Date("2024-07-01") ? 0.2 : date < new Date("2025-07-01") ? 0.45 : 0.6;
    const modeledPlaquemines = clamp(Math.round(modeledVgTotal * plaqueminesRatio), 0, modeledVgTotal);
    const modeledCalcasieu = clamp(modeledVgTotal - modeledPlaquemines, 0, modeledVgTotal);

    const realCargo = cargoMap.get(price.week);
    const usTotal = realCargo?.usTotalCargoes ?? modeledUsTotal;
    const plaqueminesCargoes = realCargo?.plaqueminesCargoes ?? modeledPlaquemines;
    const calcasieuCargoes = realCargo?.calcasieuCargoes ?? modeledCalcasieu;
    const vgTotal = plaqueminesCargoes + calcasieuCargoes;

    const ttfHh = price.ttf - price.hh;
    const jkmHh = price.jkm - price.hh;

    return {
      week: price.week,
      usTotalCargoes: usTotal,
      vgTotalCargoes: vgTotal,
      plaqueminesCargoes,
      calcasieuCargoes,
      hh: Number(price.hh.toFixed(2)),
      ttf: Number(price.ttf.toFixed(2)),
      jkm: Number(price.jkm.toFixed(2)),
      ttfHh: Number(ttfHh.toFixed(2)),
      jkmHh: Number(jkmHh.toFixed(2)),
      profitabilityFlag: ttfHh > 5 || jkmHh > 5,
      isRealCargo: Boolean(realCargo),
    };
  });

  const last = weekly[weekly.length - 1] ?? {
    hh: 0,
    ttf: 0,
    jkm: 0,
    ttfHh: 0,
    jkmHh: 0,
    vgTotalCargoes: 0,
  };

  const recent = weekly.slice(-52);
  const previous = weekly.slice(-104, -52);
  const avgRecent = recent.reduce((sum, item) => sum + item.vgTotalCargoes, 0) / (recent.length || 1);
  const avgPrev = previous.reduce((sum, item) => sum + item.vgTotalCargoes, 0) / (previous.length || 1);
  const yoy = avgPrev ? ((avgRecent - avgPrev) / avgPrev) * 100 : 0;

  const kpis: LNGDashboardKpis = {
    hh: last.hh,
    ttf: last.ttf,
    jkm: last.jkm,
    ttfHh: last.ttfHh,
    jkmHh: last.jkmHh,
    weeklyVgCargoes: last.vgTotalCargoes,
    yoyVgGrowthPct: Number(yoy.toFixed(1)),
  };

  const realCount = weekly.filter((item) => item.isRealCargo).length;
  const cargoSource = realCount
    ? "EIA Weekly Natural Gas Update (Bloomberg shipping data)"
    : "Modeled (placeholder)";

  return {
    meta,
    kpis,
    weekly,
    table: weekly.slice(-10).reverse(),
    cargoSource,
    cargoCoveragePct: weekly.length ? Number(((realCount / weekly.length) * 100).toFixed(1)) : 0,
  };
}
