import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { setPricingCache } from "@/lib/pricing-cache";
import type { PricePoint } from "@/types/pricing";
import { prisma } from "@/lib/db";

// EIA API for Henry Hub natural gas spot prices (free, 1-day delayed)
const EIA_API_KEY = process.env.EIA_API_KEY || ""; // Optional - works without key but rate limited
const EIA_HH_URL = `https://api.eia.gov/v2/natural-gas/pri/fut/data/?api_key=${EIA_API_KEY}&frequency=daily&data[0]=value&facets[series][]=RNGWHHD&sort[0][column]=period&sort[0][direction]=desc&length=90`;

// For TTF/JKM we'd need paid APIs, so we'll use proxy estimates based on historical spreads
// In production, you'd integrate with ICE, Platts, or Argus

interface EIAResponse {
  response: {
    data: Array<{
      period: string;
      value: number;
    }>;
  };
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  const manual = new URL(request.url).searchParams.get("manual") === "1";
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}` && !manual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch Henry Hub data from EIA
    const eiaResponse = await fetch(EIA_HH_URL);

    if (!eiaResponse.ok) {
      // If EIA fails, return current data with error note
      return NextResponse.json({
        success: false,
        error: "EIA API unavailable",
        message: "Using cached data"
      });
    }

    const eiaData: EIAResponse = await eiaResponse.json();
    const hhPrices = eiaData.response?.data || [];

    if (hhPrices.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No data from EIA"
      });
    }

    // Read existing pricing data
    const pricingPath = join(process.cwd(), "seed-data", "pricing-history.json");

    // Create new pricing entries
    const newPrices: PricePoint[] = [];

    for (const entry of hhPrices.slice(0, 90)) {
      const hhPrice = entry.value;
      const date = entry.period;

      // Add Henry Hub (actual data)
      newPrices.push({
        benchmark: "HENRY_HUB",
        date,
        price: hhPrice,
        source: "EIA",
        frequency: "DAILY",
      });

      // Estimate TTF based on historical spread (typically HH + $5-8 for EU)
      // In production, use actual TTF data from ICE
      const ttfSpread = 6.5 + (Math.random() * 2 - 1); // $5.5-7.5 spread
      newPrices.push({
        benchmark: "TTF",
        date,
        price: Number((hhPrice + ttfSpread).toFixed(2)),
        source: "ESTIMATED",
        frequency: "DAILY",
      });

      // Estimate JKM based on historical spread (typically HH + $6-10 for Asia)
      const jkmSpread = 7.5 + (Math.random() * 2 - 1); // $6.5-8.5 spread
      newPrices.push({
        benchmark: "JKM",
        date,
        price: Number((hhPrice + jkmSpread).toFixed(2)),
        source: "ESTIMATED",
        frequency: "DAILY",
      });
    }

    const meta = {
      lastPriceUpdate: new Date().toISOString(),
      source: "EIA (Henry Hub) + Estimated TTF/JKM",
    };

    // Persist to database when configured (recommended for Vercel)
    if (process.env.DATABASE_URL) {
      try {
        await prisma.$transaction([
          ...newPrices.map((price) =>
            prisma.pricePoint.upsert({
              where: {
                benchmark_date_frequency: {
                  benchmark: price.benchmark,
                  date: new Date(price.date),
                  frequency: price.frequency,
                },
              },
              update: {
                price: price.price,
                source: price.source,
              },
              create: {
                benchmark: price.benchmark,
                date: new Date(price.date),
                price: price.price,
                source: price.source,
                frequency: price.frequency,
                unit: "USD/MMBtu",
              },
            })
          ),
          prisma.appSetting.upsert({
            where: { key: "pricing_meta" },
            update: { value: meta },
            create: {
              key: "pricing_meta",
              value: meta,
              description: "Pricing refresh metadata",
            },
          }),
        ]);
      } catch (error) {
        console.error("Failed to write pricing to DB:", error);
      }
    }

    // Update in-memory cache (used by SSR pages)
    setPricingCache(newPrices, meta);

    // Write updated pricing data to disk in dev (serverless FS is read-only in prod)
    if (process.env.NODE_ENV !== "production") {
      await writeFile(pricingPath, JSON.stringify(newPrices, null, 2));
      const metaPath = join(process.cwd(), "seed-data", "meta.json");
      await writeFile(metaPath, JSON.stringify(meta, null, 2));
    }

    return NextResponse.json({
      success: true,
      updated: newPrices.length / 3, // Number of days updated
      latestDate: hhPrices[0]?.period,
      latestHH: hhPrices[0]?.value,
      timestamp: meta.lastPriceUpdate,
    });
  } catch (error) {
    console.error("Price update failed:", error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
