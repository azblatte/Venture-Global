import { NextResponse } from "next/server";
import { getPricingHistory } from "@/lib/seed";
import { calculateSpreads } from "@/lib/pricing";

export async function GET() {
  const pricing = await getPricingHistory();
  const spreads = calculateSpreads(pricing);
  return NextResponse.json({ spreads });
}
