import { NextResponse } from "next/server";
import { getMeta, getPricingHistory } from "@/lib/seed";
import { buildLNGDashboardData } from "@/lib/lng-dashboard";

export async function GET() {
  const [pricing, meta] = await Promise.all([getPricingHistory(), getMeta()]);
  const data = buildLNGDashboardData(pricing, meta);
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
