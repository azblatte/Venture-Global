import type { PricePoint } from "@/types/pricing";
import type { SiteMeta } from "@/lib/seed";

export interface PricingCache {
  pricing: PricePoint[];
  meta: SiteMeta;
  updatedAt: number;
}

const globalForCache = globalThis as unknown as { vgPricingCache?: PricingCache };

export function getPricingCache(): PricingCache | undefined {
  return globalForCache.vgPricingCache;
}

export function setPricingCache(pricing: PricePoint[], meta: SiteMeta) {
  globalForCache.vgPricingCache = {
    pricing,
    meta,
    updatedAt: Date.now(),
  };
}
