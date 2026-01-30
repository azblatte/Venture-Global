import { NextResponse } from "next/server";
import { getMeta, getPricingHistory } from "@/lib/seed";
import { buildLNGDashboardData } from "@/lib/lng-dashboard";
import { getCargoWeekly } from "@/lib/cargo";

export async function GET() {
  const [pricing, meta, cargo] = await Promise.all([getPricingHistory(), getMeta(), getCargoWeekly()]);
  const data = buildLNGDashboardData(pricing, meta, cargo);
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
