import { readFile } from "fs/promises";
import { join } from "path";
import { slugify } from "./utils";
import type { Vessel, VesselPosition } from "@/types/vessel";
import type { Terminal } from "@/types/terminal";
import type { PricePoint } from "@/types/pricing";
import type { Insight } from "@/types/insight";
import type { NewsArticle } from "@/types/news";

const cache = new Map<string, unknown>();

async function loadJson<T>(filename: string): Promise<T> {
  if (cache.has(filename)) {
    return cache.get(filename) as T;
  }
  const filePath = join(process.cwd(), "seed-data", filename);
  const raw = await readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw) as T;
  cache.set(filename, parsed);
  return parsed;
}

export async function getVessels(): Promise<Vessel[]> {
  const data = await loadJson<Omit<Vessel, "id">[]>("vessels.json");
  return data.map((vessel) => ({
    ...vessel,
    id: slugify(vessel.name),
  }));
}

export async function getVesselPositions(): Promise<VesselPosition[]> {
  const data = await loadJson<VesselPosition[]>("vessel-positions.json");
  return data.map((position) => ({
    ...position,
    vesselId: slugify(position.vesselName),
  }));
}

export async function getTerminals(): Promise<Terminal[]> {
  const data = await loadJson<Omit<Terminal, "id">[]>("terminals.json");
  return data.map((terminal) => ({
    ...terminal,
    id: terminal.slug,
  }));
}

export async function getPricingHistory(): Promise<PricePoint[]> {
  return loadJson<PricePoint[]>("pricing-history.json");
}

export async function getInsights(): Promise<Insight[]> {
  return loadJson<Insight[]>("insights.json");
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  return loadJson<NewsArticle[]>("news-articles.json");
}
