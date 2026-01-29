import { readFile } from "fs/promises";
import { join } from "path";
import { slugify } from "./utils";
import type { Vessel, VesselPosition } from "@/types/vessel";
import type { Terminal } from "@/types/terminal";
import type { PricePoint } from "@/types/pricing";
import type { Insight } from "@/types/insight";
import type { NewsArticle } from "@/types/news";
import type { SpaDeal } from "@/types/spa";
import { getPricingCache } from "@/lib/pricing-cache";

const cache = new Map<string, unknown>();

async function loadJson<T>(filename: string, fallback: T): Promise<T> {
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }
  try {
    const filePath = join(process.cwd(), "seed-data", filename);
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as T;
    cache.set(filename, parsed);
    return parsed;
  } catch (err) {
    console.error(`Failed to load ${filename}:`, err);
    return fallback;
  }
}

export async function getVessels(): Promise<Vessel[]> {
  const data = await loadJson<Omit<Vessel, "id">[]>("vessels.json", []);
  return data.map((vessel) => ({
    ...vessel,
    id: slugify(vessel.name),
  }));
}

export async function getVesselPositions(): Promise<VesselPosition[]> {
  const data = await loadJson<VesselPosition[]>("vessel-positions.json", []);
  return data.map((position) => ({
    ...position,
    vesselId: slugify(position.vesselName),
  }));
}

export async function getTerminals(): Promise<Terminal[]> {
  const data = await loadJson<Omit<Terminal, "id">[]>("terminals.json", []);
  return data.map((terminal) => ({
    ...terminal,
    id: terminal.slug,
  }));
}

export async function getPricingHistory(): Promise<PricePoint[]> {
  const cache = getPricingCache();
  if (cache?.pricing?.length) {
    return cache.pricing;
  }
  return loadJson<PricePoint[]>("pricing-history.json", []);
}

export async function getInsights(): Promise<Insight[]> {
  return loadJson<Insight[]>("insights.json", []);
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  return loadJson<NewsArticle[]>("news-articles.json", []);
}

export async function getSpaDeals(): Promise<SpaDeal[]> {
  const data = await loadJson<Omit<SpaDeal, "id">[]>("spa-deals.json", []);
  return data.map((deal, index) => ({
    ...deal,
    id: `spa-${index + 1}`,
  }));
}

export interface SiteMeta {
  lastPriceUpdate: string;
  source: string;
}

export async function getMeta(): Promise<SiteMeta> {
  const cache = getPricingCache();
  if (cache?.meta) {
    return cache.meta;
  }
  return loadJson<SiteMeta>("meta.json", {
    lastPriceUpdate: new Date().toISOString(),
    source: "Unknown",
  });
}
