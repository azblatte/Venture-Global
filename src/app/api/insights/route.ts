import { NextResponse } from "next/server";
import { getInsights } from "@/lib/seed";

export async function GET() {
  const insights = await getInsights();
  return NextResponse.json({ insights });
}
