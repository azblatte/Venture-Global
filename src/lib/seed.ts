import { readFile } from "fs/promises";
import { join } from "path";
import { slugify } from "./utils";
import type { Vessel, VesselPosition } from "@/types/vessel";
import type { Terminal } from "@/types/terminal";
import type { PricePoint } from "@/types/pricing";
import type { Insight } from "@/types/insight";
import type { NewsArticle } from "@/types/news";
import type { SpaDeal } from "@/types/spa";
import { getPricingCache, setPricingCache } from "@/lib/pricing-cache";
import { prisma } from "@/lib/db";

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
  const dbPricing = await getPricingFromDb();
  if (dbPricing?.length) {
    const meta = (await getMetaFromDb()) ?? {
      lastPriceUpdate: new Date().toISOString(),
      source: "Database",
    };
    setPricingCache(dbPricing, meta);
    return dbPricing;
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
  const dbMeta = await getMetaFromDb();
  if (dbMeta) {
    setPricingCache(cache?.pricing ?? [], dbMeta);
    return dbMeta;
  }
  return loadJson<SiteMeta>("meta.json", {
    lastPriceUpdate: new Date().toISOString(),
    source: "Unknown",
  });
}

async function getPricingFromDb(): Promise<PricePoint[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const points = await prisma.pricePoint.findMany({
      where: { frequency: "DAILY" },
      orderBy: { date: "asc" },
    });
    if (!points.length) return null;
    return points.map((point) => ({
      benchmark: point.benchmark,
      date: point.date.toISOString().slice(0, 10),
      price: point.price,
      source: point.source,
      frequency: point.frequency,
    }));
  } catch (error) {
    console.error("Failed to load pricing from DB:", error);
    return null;
  }
}

async function getMetaFromDb(): Promise<SiteMeta | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key: "pricing_meta" } });
    if (!setting?.value || typeof setting.value !== "object") return null;
    const value = setting.value as Record<string, unknown>;
    const lastPriceUpdate = typeof value.lastPriceUpdate === "string" ? value.lastPriceUpdate : null;
    const source = typeof value.source === "string" ? value.source : null;
    if (!lastPriceUpdate || !source) return null;
    return { lastPriceUpdate, source };
  } catch (error) {
    console.error("Failed to load pricing meta from DB:", error);
    return null;
  }
}
