export type Benchmark = "HENRY_HUB" | "TTF" | "JKM";

export interface PricePoint {
  benchmark: Benchmark;
  date: string;
  price: number;
  source: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
}

export interface SpreadPoint {
  date: string;
  ttfHhSpread: number;
  jkmHhSpread: number;
  netbackEurope: number;
  netbackAsia: number;
}
