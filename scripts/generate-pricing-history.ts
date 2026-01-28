/**
 * Generates realistic 2-year dummy pricing history for HH, TTF, JKM
 * Run: npx tsx scripts/generate-pricing-history.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

interface PriceEntry {
  benchmark: 'HENRY_HUB' | 'TTF' | 'JKM';
  date: string;
  price: number;
  source: string;
  frequency: 'DAILY';
}

function randomWalk(start: number, days: number, volatility: number, mean: number, seasonalAmp: number): number[] {
  const prices: number[] = [start];
  for (let i = 1; i < days; i++) {
    const seasonal = seasonalAmp * Math.sin((2 * Math.PI * i) / 365 + Math.PI);
    const meanReversion = 0.02 * (mean + seasonal - prices[i - 1]);
    const noise = (Math.random() - 0.5) * volatility;
    let next = prices[i - 1] + meanReversion + noise;
    next = Math.max(1.0, next);
    prices.push(Math.round(next * 100) / 100);
  }
  return prices;
}

const days = 730;
const startDate = new Date('2024-02-01');
const entries: PriceEntry[] = [];

const hhPrices = randomWalk(2.80, days, 0.15, 3.50, 1.0);
const ttfPrices = randomWalk(10.50, days, 0.40, 12.00, 3.0);
const jkmPrices = randomWalk(11.00, days, 0.45, 13.00, 3.5);

for (let i = 0; i < days; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  const dow = date.getDay();
  if (dow === 0 || dow === 6) continue;

  const dateStr = date.toISOString().split('T')[0];

  entries.push({
    benchmark: 'HENRY_HUB',
    date: dateStr,
    price: hhPrices[i],
    source: 'stub',
    frequency: 'DAILY',
  });

  entries.push({
    benchmark: 'TTF',
    date: dateStr,
    price: ttfPrices[i],
    source: 'stub',
    frequency: 'DAILY',
  });

  entries.push({
    benchmark: 'JKM',
    date: dateStr,
    price: jkmPrices[i],
    source: 'stub',
    frequency: 'DAILY',
  });
}

const outputPath = join(__dirname, '..', 'seed-data', 'pricing-history.json');
writeFileSync(outputPath, JSON.stringify(entries, null, 2));
console.log(`Generated ${entries.length} price entries to ${outputPath}`);
