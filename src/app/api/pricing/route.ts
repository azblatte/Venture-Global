import { NextResponse } from "next/server";
import { getPricingHistory } from "@/lib/seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const benchmark = searchParams.get("benchmark");
  const pricing = await getPricingHistory();
  const filtered = benchmark ? pricing.filter((point) => point.benchmark === benchmark) : pricing;
  return NextResponse.json({ pricing: filtered });
}
